import React, { useState, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import Layout from "./util/Layout";
import SellerLayout from "./util/SellerLayout";

// Buyer Pages
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";
import ProfilePage from "./pages/ProfilePage";
import AllListingsPage from "./pages/AllListingPage";
import PaymentPage from "./pages/PaymentPage";
import OrdersPage from "./pages/OrderPage";
import OrderSuccessPage from "./pages/OrderSuccussPage";

// Seller Pages
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProduct";
import SellerOrders from "./pages/seller/SellerOrder";
import AddProduct from "./pages/seller/SellerAddProduct";
import UpdateProduct from "./pages/seller/UpdateProduct";
import SellerProfile from "./pages/seller/SellerProfile";
import EditProduct from "./pages/seller/EditProduct";
import BuyerNotificationsPage from "./pages/buyer/BuyerNotificationsPage";
import SellerNotificationsPage from "./pages/seller/SellerNotificationsPage";

// Shared / Auth
import AuthPage from "./pages/AuthPage";
import Unauthorized from "./pages/Unauthorized";

// Contexts
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoriteProvider } from "./context/FavoriteContext";

// Components
import Spinner from "./components/Spinner";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavOpen, setIsFavOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const openFav = () => setIsFavOpen(true);
  const closeFav = () => setIsFavOpen(false);

  const router = createBrowserRouter([
    // Buyer Routes
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
        { index: true, element: <HomePage /> },
        { path: "listings/:id", element: <ProductDetail /> },
        { path: "all-listings", element: <AllListingsPage /> },
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
      ],
    },

    // Profile
    {
      path: "/profile",
      element: (
        <PrivateRoute>
          <ProfilePage />
        </PrivateRoute>
      ),
    },

    // Auth / Unauthorized
    { path: "/auth", element: <AuthPage /> },
    { path: "/unauthorized", element: <Unauthorized /> },

    // Seller Routes
    {
      path: "/seller/dashboard",
      element: (
        <PrivateRoute requireRole="seller">
          <SellerLayout>
            <SellerDashboard />
          </SellerLayout>
        </PrivateRoute>
      ),
    },
    {
      path: "/seller/products",
      element: (
        <PrivateRoute requireRole="seller">
          <SellerLayout>
            <SellerProducts />
          </SellerLayout>
        </PrivateRoute>
      ),
    },
    {
      path: "/seller/edit-product/:id",
      element: (
        <PrivateRoute requireRole="seller">
          <SellerLayout>
            <EditProduct />
          </SellerLayout>
        </PrivateRoute>
      ),
    },
    {
      path: "/seller/orders",
      element: (
        <PrivateRoute requireRole="seller">
          <SellerLayout>
            <SellerOrders />
          </SellerLayout>
        </PrivateRoute>
      ),
    },
    {
      path: "/seller/profile",
      element: (
        <PrivateRoute requireRole="seller">
          <SellerLayout>
            <SellerProfile />
          </SellerLayout>
        </PrivateRoute>
      ),
    },
    {
      path: "/seller/add-product",
      element: (
        <PrivateRoute requireRole="seller">
          <SellerLayout>
            <AddProduct />
          </SellerLayout>
        </PrivateRoute>
      ),
    },
    {
      path: "/seller/update-product/:id",
      element: (
        <PrivateRoute requireRole="seller">
          <SellerLayout>
            <UpdateProduct />
          </SellerLayout>
        </PrivateRoute>
      ),
    },

    // Notification Routes (fixed)
    {
      path: "/buyer/notification",
      element: (
        <PrivateRoute>
          <BuyerNotificationsPage />
        </PrivateRoute>
      ),
    },
    {
      path: "/seller/notification",
      element: (
        <PrivateRoute requireRole="seller">
          <SellerNotificationsPage />
        </PrivateRoute>
      ),
    },
  ]);

  return (
    <AuthProvider>
      <CartProvider>
        <FavoriteProvider>
          <Suspense fallback={<Spinner />}>
            <RouterProvider router={router} />
          </Suspense>
        </FavoriteProvider>
      </CartProvider>
    </AuthProvider>
  );
}
