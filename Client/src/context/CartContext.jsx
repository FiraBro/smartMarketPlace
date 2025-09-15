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
  const addItem = async (product, quantity = 1) => {
    // Optimistic update
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    try {
      await addToCart(product._id, quantity); // backend still expects id + qty
      fetchCart(); // sync
    } catch (err) {
      console.error("Failed to add item:", err);
      fetchCart(); // rollback
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
