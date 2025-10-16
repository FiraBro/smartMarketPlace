import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../services/authService";

export default function ProtectedRoute() {
  const [auth, setAuth] = useState({ loading: true, user: null });

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        setAuth({ loading: false, user });
      } catch {
        setAuth({ loading: false, user: null });
      }
    };
    checkUser();
  }, []);

  if (auth.loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">Checking session...</p>
      </div>
    );
  }

  if (!auth.user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
