import React, { useState, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoriteProvider } from "./context/FavoriteContext";
import { SocketProvider } from "./context/SocketContext";
import { NotificationProvider } from "./context/NotificationContext";

// Layout Components
import Layout from "./util/Layout";
import SellerLayout from "./util/SellerLayout";

// Authentication & Authorization
import PrivateRoute from "./components/PrivateRoute";
import AuthPage from "./pages/AuthPage";
import Unauthorized from "./pages/Unauthorized";

// Buyer Pages
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";
import ProfilePage from "./pages/ProfilePage";
import AllListingsPage from "./pages/AllListingPage";
import PaymentPage from "./pages/PaymentPage";
import OrdersPage from "./pages/OrderPage";
import OrderSuccessPage from "./pages/OrderSuccussPage";
import BuyerNotificationsPage from "./pages/buyer/BuyerNotificationsPage";

// Seller Pages
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProduct";
import SellerOrders from "./pages/seller/SellerOrder";
import AddProduct from "./pages/seller/SellerAddProduct";
import UpdateProduct from "./pages/seller/UpdateProduct";
import SellerProfile from "./pages/seller/SellerProfile";
import EditProduct from "./pages/seller/EditProduct";
import SellerNotificationsPage from "./pages/seller/SellerNotificationsPage";

// Content Pages
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FaqPage";

// UI Components
import Spinner from "./components/Spinner";

/**
 * Main Application Component
 * Handles routing, state management, and provider setup
 */
export default function App() {
  // Modal state management
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavOpen, setIsFavOpen] = useState(false);

  // Modal handlers
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const openFav = () => setIsFavOpen(true);
  const closeFav = () => setIsFavOpen(false);

  // Router configuration
  const router = createBrowserRouter([
    // ========================
    // PUBLIC ROUTES
    // ========================
    {
      path: "/auth",
      element: <AuthPage />,
    },
    {
      path: "/unauthorized",
      element: <Unauthorized />,
    },
    { path: "all-listings", element: <AllListingsPage /> },

    // ========================
    // BUYER ROUTES
    // ========================
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
        />
      ),
      children: [
        // Home & Product Routes
        { index: true, element: <HomePage /> },
        { path: "listings/:id", element: <ProductDetail /> },

        // Content Routes
        { path: "blog", element: <BlogPage /> },
        { path: "blog/:id", element: <BlogPostPage /> },
        { path: "contact", element: <ContactPage /> },
        { path: "faq", element: <FAQPage /> },

        // Protected Buyer Routes
        {
          path: "payment/:orderId",
          element: (
            <PrivateRoute>
              <PaymentPage />
            </PrivateRoute>
          ),
        },
        {
          path: "orders",
          element: (
            <PrivateRoute>
              <OrdersPage />
            </PrivateRoute>
          ),
        },
        {
          path: "order-success/:orderId",
          element: (
            <PrivateRoute>
              <OrderSuccessPage />
            </PrivateRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          ),
        },
        {
          path: "buyer/notifications",
          element: (
            <PrivateRoute>
              <BuyerNotificationsPage />
            </PrivateRoute>
          ),
        },
      ],
    },

    // ========================
    // SELLER ROUTES
    // ========================
    {
      path: "/seller",
      element: (
        <PrivateRoute requireRole="seller">
          <SellerLayout />
        </PrivateRoute>
      ),
      children: [
        // Dashboard & Profile
        { index: true, element: <SellerDashboard /> },
        { path: "dashboard", element: <SellerDashboard /> },
        { path: "profile", element: <SellerProfile /> },

        // Product Management
        { path: "products", element: <SellerProducts /> },
        { path: "add-product", element: <AddProduct /> },
        { path: "edit-product/:id", element: <EditProduct /> },
        { path: "update-product/:id", element: <UpdateProduct /> },

        // Order Management
        { path: "orders", element: <SellerOrders /> },

        // Notifications
        { path: "notifications", element: <SellerNotificationsPage /> },
      ],
    },

    // ========================
    // FALLBACK ROUTE (404)
    // ========================
    {
      path: "*",
      element: (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-gray-600 mb-8">Page not found</p>
            <a
              href="/"
              className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors"
            >
              Return Home
            </a>
          </div>
        </div>
      ),
    },
  ]);

  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <CartProvider>
            <FavoriteProvider>
              <Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <Spinner />
                  </div>
                }
              >
                <RouterProvider router={router} />
              </Suspense>
            </FavoriteProvider>
          </CartProvider>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
