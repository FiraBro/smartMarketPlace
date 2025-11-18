// src/components/layout/Header.jsx
import React from "react";
import { FiMenu, FiBell } from "react-icons/fi";

export default function Header({ setSidebarOpen }) {
  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:border-none">
      <button
        className="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <FiMenu className="h-6 w-6" />
      </button>

      <div className="flex-1 flex justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex-1 flex items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Panel</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
            <FiBell className="h-6 w-6" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-medium">A</span>
            </div>
            <span className="text-sm font-medium text-gray-700">Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
