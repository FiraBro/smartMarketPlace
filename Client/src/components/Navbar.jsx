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
import { useAuth } from "../context/AuthContext";
import { searchListings } from "../service/listingService";
export default function Navbar({ openCart, cartItems, openFav, favorites }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const categories = ["Cosmetics", "Footwear", "Accessories", "Clothing"];

  const catRef = useRef(null);
  const popupRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live search with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim()) {
        try {
          const data = await searchListings(query, selectedCategory);
          setResults(data.items || []);
          setShowPopup(true);
        } catch (err) {
          console.error("Search error:", err);
        }
      } else {
        setResults([]);
        setShowPopup(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query, selectedCategory]);

  // Close popup on outside click
  useEffect(() => {
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <nav className="bg-white px-6 py-3 shadow-sm relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600 cursor-pointer">
          Nexa<span className="text-[#f9A03f]">Mart</span>
        </div>

        {/* Search Bar */}
        <div
          className="hidden md:flex flex-1 max-w-2xl mx-6 relative"
          ref={popupRef}
        >
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-w-0 flex-1 px-4 py-2 outline-none text-sm"
              />
              <button
                type="button"
                className="bg-[#f9A03f] px-4 text-white flex items-center justify-center rounded-r-full"
              >
                <FaSearch className="w-5 h-5" />
              </button>
            </div>

            {/* Category dropdown */}
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

          {/* Popup search results */}
          {showPopup && (
            <div className="absolute top-14 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {results.length > 0 ? (
                results.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-all cursor-pointer border-b last:border-b-0"
                  >
                    <img
                      src={
                        item.images?.[0]
                          ? `${
                              import.meta.env.VITE_API_URL ||
                              "http://localhost:5000"
                            }${item.images[0]}`
                          : "https://via.placeholder.com/50"
                      }
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) =>
                        (e.currentTarget.src = "https://via.placeholder.com/50")
                      }
                    />
                    <div className="flex flex-col">
                      <p className="font-semibold text-gray-800 line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500">${item.price}</p>
                      <p className="text-xs text-gray-400">{item.category}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-gray-500 text-center">
                  No products found
                </div>
              )}
            </div>
          )}
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
