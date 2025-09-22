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
import AllListingsPage from "./pages/AllListingPage";
import AddressPage from "./pages/AddressPage";
import PaymentPage from "./pages/PaymentPage";
import OrdersPage from "./pages/OrderPage";

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

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout openFav={openFav} favorites={favorites} openCart={openCart} />
      ),
      children: [
        { index: true, element: <HomePage /> },
        { path: "/listings/:id", element: <ProductDetail /> },
        { path: "/profile", element: <Profile openFav={openFav} /> },
        { path: "/listings", element: <AllListingsPage /> },
        { path: "/address", element: <AddressPage /> },
        { path: "/payment/:orderId", element: <PaymentPage /> },
        { path: "/orders", element: <OrdersPage /> },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <CartProvider>
        <FavoriteProvider>
          <Suspense fallback={<Spinner />}>
            <RouterProvider router={router} />
          </Suspense>
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
