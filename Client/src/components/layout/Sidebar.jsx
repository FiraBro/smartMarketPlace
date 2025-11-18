// src/components/layout/Sidebar.jsx
import React from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBox,
  FiClipboard,
  FiDollarSign,
  FiAlertTriangle,
  FiVolume2, // replaced FiMegaphone
  FiBell,
  FiSettings,
  FiImage,
  FiX,
  FiChevronRight,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
const navigation = [
  { name: "Dashboard", href: "/admin", icon: FiHome },
  { name: "User Management", href: "/admin/users-management", icon: FiUsers },
  { name: "Product Catalog", href: "/admin/products", icon: FiBox },
  { name: "Orders & Fulfillment", href: "/admin/order", icon: FiClipboard },
  { name: "Dispute Resolution", href: "/admin/orders", icon: FiAlertTriangle },
  { name: "Notifications", href: "/admin/notifications", icon: FiBell },
  { name: "Settings", href: "/admin/settings", icon: FiSettings }, // optional page
  { name: "Banners", href: "/admin/manage/banners", icon: FiImage }, // optional
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const renderNavLink = (item) => {
    const isActive = location.pathname === item.href;

    return (
      <NavLink
        key={item.name}
        to={item.href}
        onClick={() => isOpen && toggleSidebar()}
        className={`group relative flex items-center justify-between p-3 rounded-xl font-medium transition-all duration-300 hover:shadow-md ${
          isActive
            ? "bg-gradient-to-r from-[#f9A03f]/10 to-amber-50/80 text-gray-900 border-l-4 border-[#f9A03f] shadow-sm"
            : "text-gray-600 hover:bg-white hover:text-gray-800 hover:border-l-4 hover:border-gray-200"
        }`}
      >
        <div className="flex items-center space-x-3">
          <item.icon
            className={`h-5 w-5 transition-colors duration-300 ${
              isActive
                ? "text-[#f9A03f]"
                : "text-gray-400 group-hover:text-gray-600"
            }`}
          />
          <span className="font-semibold text-sm">{item.name}</span>
        </div>

        {isActive ? (
          <div className="w-2 h-2 bg-[#f9A03f] rounded-full animate-pulse" />
        ) : (
          <FiChevronRight className="text-gray-300 h-3 w-3 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0.5 transition-all duration-300" />
        )}

        {!isActive && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </NavLink>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-gradient-to-b from-white to-gray-50/80 border-r border-gray-100 shadow-xl flex flex-col transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#f9A03f] to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">MA</span>
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Admin Hub
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  Management Portal
                </p>
              </div>
            </div>

            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiX className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navigation.map(renderNavLink)}

          <div className="pt-4 mt-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="group flex items-center justify-between w-full p-3 rounded-xl font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300 hover:shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <FiLogOut className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors duration-300" />
                <span className="font-semibold text-sm">Logout</span>
              </div>
              <div className="w-2 h-2 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="mt-auto border-t border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="px-6 py-4 text-center">
            <div className="mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#f9A03f] to-amber-500 rounded-lg flex items-center justify-center mx-auto shadow-md">
                <span className="text-white font-bold text-xs">AH</span>
              </div>
            </div>

            <p className="text-xs text-gray-600 font-semibold">
              You're Managing Great!
            </p>
            <p className="text-xs text-gray-400 mt-1">
              © 2025 All rights reserved
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
