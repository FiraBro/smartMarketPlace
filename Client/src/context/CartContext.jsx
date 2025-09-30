// context/CartContext.js
import { createContext, useContext, useState, useEffect } from "react";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  checkoutCart,
  payWithCOD,
  payWithTeleBirr,
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

  

  const addItem = async (product, quantity = 1) => {
    // Optimistic update
    setCart((prev) => {
      const existing = prev.find(
        (item) => item._id === product._id || item.id === product._id
      );
      if (existing) {
        return prev.map((item) =>
          item._id === product._id || item.id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    try {
      await addToCart(product._id, quantity); // backend expects id + qty
      fetchCart(); // sync with backend
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

  // -------------------
  // ✅ Checkout & Payments
  // -------------------

  const checkout = async () => {
    try {
      setLoading(true);
      const order = await checkoutCart(); // creates order in backend
      return order; // return order so UI can decide payment method
    } catch (err) {
      console.error("Checkout failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const payCOD = async (orderId) => {
    try {
      setLoading(true);
      const res = await payWithCOD(orderId);
      await fetchCart(); // refresh after checkout
      return res;
    } catch (err) {
      console.error("COD payment failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const payTeleBirr = async (orderId, phone) => {
    try {
      setLoading(true);
      const res = await payWithTeleBirr(orderId, phone);
      return res; // contains paymentUrl, order
    } catch (err) {
      console.error("TeleBirr payment failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addItem,
        removeItem,
        clear,
        checkout,
        payCOD,
        payTeleBirr,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
