import React, { useState, useRef, useEffect } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import AuthModal from "./AuthModal";
import { useAuth } from "../context/AuthContext"; // ✅ import auth hook

export default function Navbar({ openCart, cartItems, openFav, favorites }) {
  const { user, logout } = useAuth(); // ✅ get logged-in user
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const categories = ["Cosmetics", "Footwear", "Accessories", "Clothing"];

  // close dropdown on outside click
  const catRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <nav className="bg-white px-6 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600 cursor-pointer">
          Nexa<span className="text-[#f9A03f]">Mart</span>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-6">
          <div className="relative w-full" ref={catRef}>
            <div className="flex w-full border border-gray-300 rounded-full">
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
                className="flex items-center px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 border-r border-gray-300 rounded-l-full"
              >
                {selectedCategory}
                <FaChevronDown className="ml-2 w-4 h-4" />
              </button>
              <input
                type="text"
                placeholder="Search products..."
                className="min-w-0 flex-1 px-4 py-2 outline-none text-sm"
              />
              <button
                type="button"
                className="bg-[#f9A03f] px-4 text-white flex items-center justify-center rounded-r-full"
              >
                <FaSearch className="w-5 h-5" />
              </button>
            </div>

            {dropdownOpen && (
              <div
                role="menu"
                className="absolute left-0 top-12 bg-white border border-gray-300 rounded-xl shadow-lg w-44 z-50"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Favorites */}
              <button
                onClick={openFav}
                className="relative flex items-center justify-center"
              >
                <FaHeart className="w-6 h-6 text-gray-700 hover:text-red-600 transition" />
                {favorites?.length > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-2 py-0.5">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative flex items-center justify-center"
              >
                <FaShoppingCart className="w-6 h-6 text-gray-700" />
                {cartItems?.length > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-2 py-0.5">
                    {cartItems.length}
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
            // If not logged in → show Login/Register
            <div className="hidden md:flex items-center gap-3">
              <div className="flex rounded-full overflow-hidden border border-gray-300">
                <button
                  onClick={() => openAuthModal("login")}
                  className="px-6 py-2 bg-white text-gray-800 font-medium hover:bg-gray-100 transition-all duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => openAuthModal("register")}
                  className="px-6 py-2 bg-[#F9A03F] text-white font-medium hover:bg-orange-600 transition-all duration-300"
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

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
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
