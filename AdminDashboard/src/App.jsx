import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppContent } from "./utils/AppContent";
import ProtectedRoute from "./components/auth/ProtectedRoute";

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

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AppContent />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "admin/users", element: <UserManagement /> },
          { path: "admin/products", element: <ProductManagement /> },
          { path: "admin/orders", element: <OrderManagement /> },
          { path: "admin/financial", element: <FinancialManagement /> },
          { path: "admin/disputes", element: <DisputeResolution /> },
          { path: "admin/marketing", element: <Marketing /> },
          { path: "admin/settings", element: <Settings /> },
          { path: "admin/notifications", element: <Notifications /> },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
