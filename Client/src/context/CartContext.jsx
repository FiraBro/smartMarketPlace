// context/CartContext.js
import { createContext, useContext, useState, useEffect } from "react";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../service/cartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

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

  const addItem = async (productId, quantity = 1) => {
    // ✅ Optimistically update local state
    setCart((prev) => {
      const existing = prev.find(
        (item) => item._id === productId || item.id === productId
      );
      if (existing) {
        return prev.map((item) =>
          item._id === productId || item.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { _id: productId, quantity }];
    });

    try {
      await addToCart(productId, quantity);
      fetchCart(); // sync with backend
    } catch (err) {
      console.error("Failed to add item:", err);
      fetchCart(); // rollback in case of error
    }
  };

  const removeItem = async (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id && item.id !== id));
    try {
      await removeFromCart(id);
      fetchCart();
    } catch (err) {
      console.error("Failed to remove item:", err);
      fetchCart();
    }
  };

  const clear = async () => {
    setCart([]); // clear instantly
    try {
      await clearCart();
    } catch (err) {
      console.error("Failed to clear cart:", err);
      fetchCart();
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, fetchCart, addItem, removeItem, clear }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
