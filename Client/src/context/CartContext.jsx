import { createContext, useContext, useState, useEffect } from "react";
import {
  getCart,
  addToCart as addToCartService,
  removeFromCart,
  clearCart,
  updateCartItem,
} from "../service/cartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data.items || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  // ✅ Add item to cart
  // CartContext.js
  const addItem = async (item, quantity = 1) => {
    // Optimistic update
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });

    try {
      // send _id to backend
      await addToCartService(item.id, quantity);
      // no need to immediately fetchCart() — your optimistic update is enough
    } catch (err) {
      console.error("Failed to add item:", err);
      // rollback if backend fails
      fetchCart();
    }
  };

  // ✅ Increase / Decrease
  const updateQuantity = async (item, newQuantity) => {
    setCart((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, quantity: newQuantity } : i))
    );

    try {
      await updateCartItem({ listingId: item.id, quantity: newQuantity });
    } catch (err) {
      console.error("Failed to update quantity:", err);
      fetchCart();
    }
  };

  const increaseQuantity = (item) => updateQuantity(item, item.quantity + 1);

  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item, item.quantity - 1);
    } else {
      removeItem(item.id);
    }
  };

  const removeItem = async (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
    try {
      await removeFromCart(id);
    } catch (err) {
      console.error("Failed to remove item:", err);
      fetchCart();
    }
  };

  const clear = async () => {
    setCart([]);
    try {
      await clearCart();
    } catch (err) {
      console.error("Failed to clear cart:", err);
      fetchCart();
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addItem, // ✅ expose addItem
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
