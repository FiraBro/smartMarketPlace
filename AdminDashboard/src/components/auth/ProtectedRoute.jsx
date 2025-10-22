import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex w-11/12 max-w-3xl min-h-[60vh] rounded-3xl overflow-hidden shadow-2xl">
          <div
            className="w-1/2 flex flex-col justify-center items-center text-center px-12"
            style={{ backgroundColor: "#f9A03f" }}
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Checking Session
            </h1>
            <p className="text-white/90 text-lg">
              Please wait while we verify your credentials.
            </p>
          </div>

          <div className="w-1/2 bg-white flex items-center justify-center p-12">
            <p className="text-gray-600 text-lg">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // If no admin (not logged in), redirect to login page
  if (!admin) {
    return <Navigate to="/auth" replace />;
  }

  // ✅ Render nested routes (Dashboard, Users, etc.)
  return <Outlet />;
}
