import React, { useState, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// ------------------------------
// Layouts
// ------------------------------
import Layout from "./util/Layout";
import SellerLayout from "./util/SellerLayout";

// ------------------------------
// Buyer Pages
// ------------------------------
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./components/Profile";
import AllListingsPage from "./pages/AllListingPage";
import PaymentPage from "./pages/PaymentPage";
import OrdersPage from "./pages/OrderPage";
import OrderSuccessPage from "./pages/OrderSuccussPage";

// ------------------------------
// Seller Pages
// ------------------------------
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProduct";
import SellerOrders from "./pages/seller/SellerOrder";
import AddProduct from "./pages/seller/SellerAddProduct";
import UpdateProduct from "./pages/seller/UpdateProduct";
import SellerProfile from "./pages/seller/SellerProfile";

// ------------------------------
// Contexts
// ------------------------------
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoriteProvider } from "./context/FavoriteContext";

// ------------------------------
// Components
// ------------------------------
import Spinner from "./components/Spinner";

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavOpen, setIsFavOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const openFav = () => setIsFavOpen(true);
  const closeFav = () => setIsFavOpen(false);

  const router = createBrowserRouter([
    // ------------------------------
    // 🛍️ BUYER ROUTES
    // ------------------------------
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
          onCheckout={(order) => console.log("Order placed:", order)}
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

    // ------------------------------
    // 🧑‍💼 SELLER ROUTES
    // ------------------------------
    {
      path: "/seller/dashboard",
      element: (
        <SellerLayout>
          <SellerDashboard />
        </SellerLayout>
      ),
    },
    {
      path: "/seller/products",
      element: (
        <SellerLayout>
          <SellerProducts />
        </SellerLayout>
      ),
    },
    {
      path: "/seller/orders",
      element: (
        <SellerLayout>
          <SellerOrders />
        </SellerLayout>
      ),
    },
    {
      path: "/seller/profile",
      element: (
        <SellerLayout>
          <SellerProfile />
        </SellerLayout>
      ),
    },
    {
      path: "/seller/add-product",
      element: (
        <SellerLayout>
          <AddProduct />
        </SellerLayout>
      ),
    },

    {
      path: "/seller/update-product/:id",
      element: (
        <SellerLayout>
          <UpdateProduct />
        </SellerLayout>
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
