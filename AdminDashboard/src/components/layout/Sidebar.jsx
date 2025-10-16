import React from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ChartBarSquareIcon,
  UsersIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ShieldExclamationIcon,
  MegaphoneIcon,
  Cog6ToothIcon,
  BellAlertIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { logoutUser } from "../../services/authService";
const navigation = [
  { name: "Dashboard", href: "/", icon: ChartBarSquareIcon },
  { name: "User Management", href: "/users", icon: UsersIcon },
  { name: "Product Catalog", href: "/products", icon: ShoppingBagIcon },
  {
    name: "Orders & Fulfillment",
    href: "/orders",
    icon: ClipboardDocumentListIcon,
  },
  {
    name: "Financial Management",
    href: "/financial",
    icon: CurrencyDollarIcon,
  },
  {
    name: "Dispute Resolution",
    href: "/disputes",
    icon: ShieldExclamationIcon,
  },
  { name: "Content & Marketing", href: "/marketing", icon: MegaphoneIcon },
  { name: "Notifications", href: "/notifications", icon: BellAlertIcon },
  { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
];

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();

  // ✅ Logout handler
  const handleLogout = () => {
    logoutUser();
    navigate("/auth/login"); // redirect to login page
  };

  return (
    <>
      {/* Mobile sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: open ? 0 : -300 }}
        className="lg:hidden fixed inset-0 z-50"
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setOpen(false)}
        />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-between px-4">
              <h1 className="text-xl font-bold text-gray-900">
                Marketplace Admin
              </h1>
              <button onClick={() => setOpen(false)} className="p-2">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-8 px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <item.icon className="mr-3 h-6 w-6" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* ✅ Logout Button (Mobile) */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-gray-900">
                  Marketplace Admin
                </h1>
              </div>
              <nav className="mt-8 flex-1 px-4 bg-white space-y-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? "bg-blue-100 text-blue-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                  >
                    <item.icon className="mr-3 h-6 w-6" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* ✅ Logout Button (Desktop) */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
