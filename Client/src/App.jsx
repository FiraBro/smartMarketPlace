import React, { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import CartPopup from "./components/CartPopup";
import FavoritePopup from "./components/FavoritePopup";
import AuthModal from "./components/AuthModal";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./util/Layout";
import { AuthProvider } from "./context/AuthContext";
import ProductDetail from "./pages/ProductDetail";
import { getCart, removeFromCart, clearCart } from "./service/cartService"; // ✅ use cartService

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]); // can later connect to a favoriteService
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavOpen, setIsFavOpen] = useState(false);

  // ✅ Fetch cart from backend when app loads
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCartItems(data.items || []);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openFav = () => setIsFavOpen(true);
  const closeFav = () => setIsFavOpen(false);

  const handleRemoveCart = async (id) => {
    try {
      await removeFromCart(id);
      fetchCart(); // refresh after removal
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      setCartItems([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const handleRemoveFav = (id) =>
    setFavorites((prev) => prev.filter((i) => i.id !== id));

  const handleCheckout = () => {
    console.log("checkout");
    closeCart();
  };

  // ✅ Routes
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout
          cartItems={cartItems}
          openFav={openFav}
          favorites={favorites}
          openCart={openCart}
        />
      ),
      children: [
        { index: true, element: <HomePage /> },
        {
          path: "/product/:id",
          element: <ProductDetail />,
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />

      {/* Modals live outside router so they overlay */}
      <CartPopup
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        onRemove={handleRemoveCart}
        onCheckout={handleCheckout}
        onClear={handleClearCart} // ✅ extra prop for "clear all"
      />
      <FavoritePopup
        isOpen={isFavOpen}
        onClose={closeFav}
        favorites={favorites}
        onRemove={handleRemoveFav}
      />
      <AuthModal />
    </AuthProvider>
  );
}
