// src/components/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">Checking session...</p>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
