import React, { useState } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(true); // toggle state

  return (
    <nav className="bg-white shadow-md px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600 cursor-pointer">
          TINA<span className="text-gray-800">MART</span>
        </div>

        {/* Search Bar (center for desktop) */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-6">
          <div className="flex w-full border border-gray-300 rounded-full overflow-hidden">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-4 py-2 outline-none text-sm"
            />
            <button className="bg-blue-600 px-4 text-white flex items-center justify-center">
              <FaSearch className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4">
          <button className="relative">
            <FaHeart className="w-6 h-6 text-gray-700" />
          </button>
          <button className="relative">
            <FaShoppingCart className="w-6 h-6 text-gray-700" />
          </button>

          {/* Toggle Login/Register */}
          <button
            onClick={() => setShowLogin(!showLogin)}
            className={`hidden md:inline-block px-4 py-1 rounded-full text-sm transition-all duration-300 ${
              showLogin
                ? "border text-gray-700 hover:bg-gray-100"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {showLogin ? "Login" : "Register"}
          </button>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-3 space-y-3">
          {/* Search bar */}
          <div className="flex w-full border border-gray-300 rounded-full overflow-hidden">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-4 py-2 outline-none text-sm"
            />
            <button className="bg-blue-600 px-4 text-white flex items-center justify-center">
              <FaSearch className="w-5 h-5" />
            </button>
          </div>

          {/* Toggle Login/Register */}
          <button
            onClick={() => setShowLogin(!showLogin)}
            className={`w-full px-4 py-2 rounded-full text-sm transition-all duration-300 ${
              showLogin
                ? "border text-gray-700 hover:bg-gray-100"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {showLogin ? "Login" : "Register"}
          </button>
        </div>
      )}
    </nav>
  );
}
