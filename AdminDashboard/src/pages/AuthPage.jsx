import { Outlet } from "react-router-dom";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Outlet />
    </div>
  );
}
