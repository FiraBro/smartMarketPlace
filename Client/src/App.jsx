import React, { useState, Suspense } from "react";
import HomePage from "./pages/HomePage";
import CartPopup from "./components/CartPopup";
import FavoritePopup from "./components/FavoritePopup";
import AuthModal from "./components/AuthModal";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./util/Layout";
import { AuthProvider } from "./context/AuthContext";
import ProductDetail from "./pages/ProductDetail";
import { FavoriteProvider } from "./context/FavoriteContext";
import { CartProvider } from "./context/CartContext";
import Spinner from "./components/Spinner";
import Profile from "./components/Profile";
export default function App() {
  const [favorites, setFavorites] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavOpen, setIsFavOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openFav = () => setIsFavOpen(true);
  const closeFav = () => setIsFavOpen(false);

  const handleRemoveFav = (id) =>
    setFavorites((prev) => prev.filter((i) => i.id !== id));

  const handleCheckout = () => {
    console.log("checkout");
    closeCart();
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout openFav={openFav} favorites={favorites} openCart={openCart} />
      ),
      children: [
        { index: true, element: <HomePage /> },
        { path: "/listings/:id", element: <ProductDetail /> },
        { path: "/profile", element: <Profile /> },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <CartProvider>
        <FavoriteProvider>
          {/* Suspense fallback shows Spinner while routes/components load */}
          <Suspense fallback={<Spinner />}>
            <RouterProvider router={router} />
          </Suspense>

          {/* Popups */}
          <CartPopup
            isOpen={isCartOpen}
            onClose={closeCart}
            onCheckout={handleCheckout}
          />
          <FavoritePopup
            isOpen={isFavOpen}
            onClose={closeFav}
            favorites={favorites}
            onRemove={handleRemoveFav}
          />
          <AuthModal />
        </FavoriteProvider>
      </CartProvider>
    </AuthProvider>
  );
}
