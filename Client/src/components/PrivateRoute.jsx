import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, requireRole }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  if (!user) {
    // Redirect to login, preserving where the user came from
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requireRole && user.role !== requireRole) {
    // Optional: restrict access to certain roles
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
