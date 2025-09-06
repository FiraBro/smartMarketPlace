import React, { useState } from "react";
import { FaShoppingCart, FaHeart, FaBars, FaTimes } from "react-icons/fa";
import AuthModal from "./AuthModal";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext"; // 🔥 use CartContext
import SearchBar from "./SearchBar";

export default function Navbar({ openCart, openFav, favorites }) {
  const { user, logout } = useAuth();
  const { cart } = useCart(); 
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  // ✅ calculate total items (instead of just array length)
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white px-6 py-3 shadow-sm relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600 cursor-pointer">
          <a href="/">
            Nexa<span className="text-[#f9A03f]">Mart</span>
          </a>
        </div>

        {/* Search Bar */}
        <SearchBar />

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Favorites */}
              <button onClick={openFav} className="relative">
                <FaHeart className="w-6 h-6 text-gray-700 hover:text-red-600 transition" />
                {favorites?.length > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-2 py-0.5">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button onClick={openCart} className="relative">
                <FaShoppingCart className="w-6 h-6 text-gray-700" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-2 py-0.5">
                    {totalCartItems}
                  </span>
                )}
              </button>

              {/* Logout */}
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex rounded-full overflow-hidden border border-gray-300">
                <button
                  onClick={() => openAuthModal("login")}
                  className="px-6 py-2 bg-white text-gray-800 font-medium hover:bg-gray-100 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => openAuthModal("register")}
                  className="px-6 py-2 bg-[#F9A03F] text-white font-medium hover:bg-orange-600 transition"
                >
                  Register
                </button>
              </div>
            </div>
          )}

          {/* Auth Modal */}
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            mode={authMode}
            onSwitchMode={() =>
              setAuthMode(authMode === "login" ? "register" : "login")
            }
          />

          {/* Mobile Menu */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
