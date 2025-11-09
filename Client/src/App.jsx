import { useState, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// ========================
// CONTEXT PROVIDERS
// ========================
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoriteProvider } from "./context/FavoriteContext";
import { SocketProvider } from "./context/SocketContext";
import { NotificationProvider } from "./context/NotificationContext";

// ========================
// LAYOUT COMPONENTS
// ========================
import Layout from "./util/Layout";
import SellerLayout from "./util/SellerLayout";

// ========================
// AUTH & PROTECTED ROUTES
// ========================
import PrivateRoute from "./components/PrivateRoute";
import AuthPage from "./pages/AuthPage";
import Unauthorized from "./pages/Unauthorized";

// ========================
// BUYER PAGES
// ========================
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";
import ProfilePage from "./pages/ProfilePage";
import AllListingsPage from "./pages/AllListingPage";
import OrdersPage from "./pages/OrderPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import OrderSuccessPage from "./pages/OrderSuccussPage";
import BuyerNotificationsPage from "./pages/buyer/BuyerNotificationsPage";

// ========================
// SELLER PAGES
// ========================
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProduct";
import SellerOrders from "./pages/seller/SellerOrder";
import AddProduct from "./pages/seller/SellerAddProduct";
import UpdateProduct from "./pages/seller/UpdateProduct";
import EditProduct from "./pages/seller/EditProduct";
import SellerProfile from "./pages/seller/SellerProfile";
import SellerNotificationsPage from "./pages/seller/SellerNotificationsPage";

// ========================
// CONTENT PAGES
// ========================
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FaqPage";

// ========================
// UI COMPONENTS
// ========================
import Spinner from "./components/Spinner";

export default function App() {
  // ========================
  // MODAL STATES
  // ========================
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavOpen, setIsFavOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const openFav = () => setIsFavOpen(true);
  const closeFav = () => setIsFavOpen(false);

  // ========================
  // ROUTER CONFIGURATION
  // ========================
  const router = createBrowserRouter([
    // PUBLIC ROUTES
    { path: "/auth", element: <AuthPage /> },
    { path: "/unauthorized", element: <Unauthorized /> },
    { path: "all-listings", element: <AllListingsPage /> },

    // BUYER ROUTES
    {
      path: "/",
      element: (
        <Layout
          openCart={openCart}
          closeCart={closeCart}
          openFav={openFav}
          closeFav={closeFav}
          isCartOpen={isCartOpen}
          isFavOpen={isFavOpen}
        />
      ),
      children: [
        { index: true, element: <HomePage /> },
        { path: "listings/:id", element: <ProductDetail /> },
        { path: "blog", element: <BlogPage /> },
        { path: "blog/:id", element: <BlogPostPage /> },
        { path: "contact", element: <ContactPage /> },
        { path: "faq", element: <FAQPage /> },

        // Protected Buyer Pages
        {
          path: "orders",
          element: (
            <PrivateRoute>
              <OrdersPage />
            </PrivateRoute>
          ),
        },
        {
          path: "orders/:id",
          element: (
            <PrivateRoute>
              <OrderDetailPage />
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

    // SELLER ROUTES
    {
      path: "/seller",
      element: (
        <PrivateRoute requireRole="seller">
          <SellerLayout />
        </PrivateRoute>
      ),
      children: [
        { index: true, element: <SellerDashboard /> },
        { path: "dashboard", element: <SellerDashboard /> },
        { path: "profile", element: <SellerProfile /> },
        { path: "products", element: <SellerProducts /> },
        { path: "add-product", element: <AddProduct /> },
        { path: "edit-product/:id", element: <EditProduct /> },
        { path: "update-product/:id", element: <UpdateProduct /> },
        { path: "orders", element: <SellerOrders /> },
        { path: "notifications", element: <SellerNotificationsPage /> },
      ],
    },

    // FALLBACK ROUTE (404)
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
              {/* ✅ Toaster for toast notifications */}
              <Toaster position="top-right" reverseOrder={false} />

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
