import { Link, useLocation } from "react-router-dom";
import {
  FaBox,
  FaHome,
  FaUser,
  FaPlus,
  FaBell,
  FaClipboardList,
} from "react-icons/fa";

const links = [
  { name: "Dashboard", icon: <FaHome />, path: "/seller/dashboard" },
  { name: "Products", icon: <FaBox />, path: "/seller/products" },
  { name: "Add Product", icon: <FaPlus />, path: "/seller/add-product" },
  { name: "Orders", icon: <FaClipboardList />, path: "/seller/orders" },
  { name: "Profile", icon: <FaUser />, path: "/seller/profile" },
  { name: "Notifications", icon: <FaBell />, path: "/seller/notifications" },
];

export default function SellerSidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-400 bg-opacity-30 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="text-center py-5 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">Seller Panel</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {links.map((link, i) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={i}
                to={link.path}
                onClick={() => isOpen && toggleSidebar()}
                className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-0 active:outline-none ${
                  isActive
                    ? "bg-gray-50 text-gray-700 border-blue-100 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <span className="text-gray-700">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto border-t border-gray-200 py-4 text-center text-sm text-gray-500">
          © 2025 Abdihope
        </div>
      </div>
    </>
  );
}
