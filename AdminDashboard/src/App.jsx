import React, { useState } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import ProductManagement from "./pages/ProductManagement";
import OrderManagement from "./pages/OrderManagement";
import FinancialManagement from "./pages/FinancialManagement";
import DisputeResolution from "./pages/DisputeResolution";
import Marketing from "./pages/Marketing";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import AuthPage from "./pages/AuthPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-auto p-4">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ✅ Router configuration
const router = createBrowserRouter([
  {
    element: <ProtectedRoute />, // protect all admin routes
    children: [
      {
        path: "/",
        element: <AppContent />,
        children: [
          { path: "/", element: <Dashboard /> },
          { path: "users", element: <UserManagement /> },
          { path: "products", element: <ProductManagement /> },
          { path: "orders", element: <OrderManagement /> },
          { path: "financial", element: <FinancialManagement /> },
          { path: "disputes", element: <DisputeResolution /> },
          { path: "marketing", element: <Marketing /> },
          { path: "settings", element: <Settings /> },
          { path: "notifications", element: <Notifications /> },
        ],
      },
    ],
  },

  // ✅ Public Auth Routes
  {
    path: "/auth",
    element: <AuthPage />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
