import React, { useState } from "react";
import { FaShoppingCart, FaHeart, FaBars, FaTimes } from "react-icons/fa";
import AuthModal from "./AuthModal";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
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

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white px-4 md:px-6 py-3 shadow-sm relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600 flex-shrink-0">
          <a href="/">
            Nexa<span className="text-[#f9A03f]">Mart</span>
          </a>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 mx-4">
          <SearchBar />
        </div>

        {/* Desktop Icons */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <>
              <button onClick={openFav} className="relative">
                <FaHeart className="w-6 h-6 text-gray-700 hover:text-red-600 transition" />
                {favorites?.length > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-2 py-0.5">
                    {favorites.length}
                  </span>
                )}
              </button>

              <button onClick={openCart} className="relative">
                <FaShoppingCart className="w-6 h-6 text-gray-700" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-2 py-0.5">
                    {totalCartItems}
                  </span>
                )}
              </button>

              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openAuthModal("login")}
                className="px-4 py-2 bg-white border rounded-lg text-gray-800 hover:bg-gray-100"
              >
                Login
              </button>
              <button
                onClick={() => openAuthModal("register")}
                className="px-4 py-2 bg-[#F9A03F] text-white rounded-lg hover:bg-orange-600"
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="sm:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden transition-all duration-300 ease-in-out ${
          menuOpen
            ? "max-h-96 opacity-100 mt-3"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="bg-gray-50 shadow-lg rounded-lg p-4 space-y-3">
          {/* Mobile Search Bar - Always rendered but conditionally visible */}
          <div className="w-full">
            <SearchBar />
          </div>

          {user ? (
            <>
              <button
                onClick={openFav}
                className="flex items-center gap-2 w-full text-left"
              >
                <FaHeart className="text-red-500" /> Favorites (
                {favorites?.length || 0})
              </button>
              <button
                onClick={openCart}
                className="flex items-center gap-2 w-full text-left"
              >
                <FaShoppingCart className="text-blue-500" /> Cart (
                {totalCartItems})
              </button>
              <button
                onClick={logout}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openAuthModal("login")}
                className="w-full px-4 py-2 bg-white border rounded-lg text-gray-800 hover:bg-gray-100"
              >
                Login
              </button>
              <button
                onClick={() => openAuthModal("register")}
                className="w-full px-4 py-2 bg-[#F9A03F] text-white rounded-lg hover:bg-orange-600"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        mode={authMode}
        onSwitchMode={() =>
          setAuthMode(authMode === "login" ? "register" : "login")
        }
      />
    </nav>
  );
}
