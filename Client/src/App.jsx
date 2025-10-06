import React, { useState, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./util/Layout";
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./components/Profile";
import AllListingsPage from "./pages/AllListingPage";
import PaymentPage from "./pages/PaymentPage";
import OrdersPage from "./pages/OrderPage";
import OrderSuccessPage from "./pages/OrderSuccussPage";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoriteProvider } from "./context/FavoriteContext";

import { Toaster } from "react-hot-toast";
import Spinner from "./components/Spinner";

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavOpen, setIsFavOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const openFav = () => setIsFavOpen(true);
  const closeFav = () => setIsFavOpen(false);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout
          openCart={openCart}
          openFav={openFav}
          isCartOpen={isCartOpen}
          isFavOpen={isFavOpen}
          closeCart={closeCart}
          closeFav={closeFav}
          onCheckout={(order) => {
            console.log("Order placed successfully:", order);
          }}
        />
      ),
      children: [
        { index: true, element: <HomePage /> },
        { path: "/listings/:id", element: <ProductDetail /> },
        { path: "/profile", element: <Profile /> },
        { path: "/all-listings", element: <AllListingsPage /> },
        { path: "/payment/:orderId", element: <PaymentPage /> },
        { path: "/orders", element: <OrdersPage /> },
        { path: "/order-success/:orderId", element: <OrderSuccessPage /> },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <CartProvider>
        <FavoriteProvider>
          <Suspense fallback={<Spinner />}>
            <RouterProvider router={router} />
            <Toaster
              position="top-right"
              toastOptions={{
                // Default options for all toasts
                duration: 3000,
                style: {
                  padding: "10px 16px",
                  color: "#fff",
                  fontWeight: "500",
                  borderRadius: "0.5rem",
                  fontFamily: "Inter, sans-serif",
                },
                success: {
                  style: {
                    background: "#10B981", // Tailwind green-500
                  },
                },
                error: {
                  style: {
                    background: "#EF4444", // Tailwind red-500
                  },
                },
                loading: {
                  style: {
                    background: "#3B82F6", // Tailwind blue-500
                  },
                },
              }}
            />
          </Suspense>
        </FavoriteProvider>
      </CartProvider>
    </AuthProvider>
  );
}
