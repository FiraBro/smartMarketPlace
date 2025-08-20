import React, { useState } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import AuthModal from "./AuthModel";

export default function Navbar({ openCart, cartItems, openFav, favorites }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  const [isAuthOpen, setIsAuthOpen] = useState(false);

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
          <button
            onClick={openFav}
            className="relative flex items-center justify-center"
          >
            <FaHeart className="w-6 h-6 text-gray-700 cursor-pointer hover:text-red-600 transition" />
            {favorites?.length > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-2 py-0.5">
                {favorites.length}
              </span>
            )}
          </button>

          {/* ✅ Cart Button */}
          <button
            onClick={openCart}
            className="relative flex items-center justify-center"
          >
            <FaShoppingCart className="w-6 h-6 text-gray-700 cursor-pointer" />
            {cartItems?.length > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-2 py-0.5">
                {cartItems.length}
              </span>
            )}
          </button>

          {/* Toggle Login/Register */}
          <div className="flex items-center gap-3">
            {/* Login Button */}
            <div className="flex rounded-full overflow-hidden border border-gray-300 ">
              {/* Login Button */}
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-6 py-2 bg-white text-[#000]  font-medium  transition-all duration-300 cursor-pointer"
              >
                Login
              </button>

              {/* Register Button */}
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-6 py-2 bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all duration-300 rounded-full cursor-pointer"
              >
                Register
              </button>
            </div>
          </div>

          {/* Auth Modal */}
          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

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
