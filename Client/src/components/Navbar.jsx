import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSearch, FaChevronDown } from "react-icons/fa";
import { MdShoppingCart, MdFavorite } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion"; // ✅ added
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoriteContext";
import { useNotification } from "../context/NotificationContext";
import SearchBar from "./SearchBar";
import NotificationList from "./NotificationList";
import { fetchProductsByCategory } from "../service/categoryService";

export default function Navbar({ openCart, openFav, openCategoryPopup }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const { unreadCount } = useNotification();

  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const profileRef = useRef(null);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalFavItems = favorites?.length || 0;

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setProfileOpen(false);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white px-4 md:px-8 py-4 shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
        >
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-xl shadow-md transform group-hover:scale-105 transition-transform duration-300">
            <span className="text-2xl font-black text-white">Wait</span>
          </div>
          <div className="text-2xl font-black text-gray-900 tracking-tight">
            Until<span className="text-amber-500">Finish</span>
          </div>
        </div>

        {/* Search (desktop) */}
        <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
          <SearchBar
            onCategorySelect={async (category) => {
              try {
                const data = await fetchProductsByCategory(category);
                openCategoryPopup(
                  category,
                  Array.isArray(data.items) ? data.items : []
                );
              } catch {
                openCategoryPopup(category, []);
              }
            }}
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Mobile search toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="lg:hidden p-3 text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300"
              >
                <FaSearch className="w-5 h-5" />
              </button>

              {/* Favorites */}
              <button
                onClick={openFav}
                className="relative p-3 text-[#f9A03f] hover:bg-gray-100 rounded-2xl transition-all duration-300 group"
              >
                <MdFavorite className="w-6 h-6 group-hover:scale-110 transition-transform duration-300 group-hover:text-rose-500" />
                {totalFavItems > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs bg-rose-500 text-white rounded-full px-1.5 py-0.5 min-w-[20px] text-center shadow-lg">
                    {totalFavItems}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-3 text-[#f9A03f] hover:bg-gray-100 rounded-2xl transition-all duration-300 group"
              >
                <MdShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-300 group-hover:text-emerald-600" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs bg-emerald-500 text-white rounded-full px-1.5 py-0.5 min-w-[20px] text-center shadow-lg">
                    {totalCartItems}
                  </span>
                )}
              </button>

              {/* Notifications */}
              {unreadCount > 0 && <NotificationList userType={user.role} />}

              {/* Profile Dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded-2xl transition-all duration-300 group border border-gray-200"
                >
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-1.5 rounded-full">
                    <FaUserCircle className="w-5 h-5 text-white" />
                  </div>
                  <FaChevronDown
                    className={`w-3 h-3 transition-transform duration-300 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-3 w-56 bg-white shadow-2xl rounded-xl py-3 z-50 border border-gray-200"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">
                          Welcome back!
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setProfileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 hover:bg-amber-50 text-gray-700 hover:text-amber-700 transition-colors duration-200"
                      >
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          navigate("/orders");
                          setProfileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 hover:bg-amber-50 text-gray-700 hover:text-amber-700 transition-colors duration-200"
                      >
                        My Orders
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors duration-200 border-t border-gray-100 mt-2"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/auth")}
                className="px-4 py-2.5 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-md transition-all duration-300 font-semibold"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search (Smooth Animated) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            key="searchbar"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:hidden mt-4 px-2"
          >
            <SearchBar
              onCategorySelect={async (category) => {
                try {
                  const data = await fetchProductsByCategory(category);
                  openCategoryPopup(
                    category,
                    Array.isArray(data.items) ? data.items : []
                  );
                } catch {
                  openCategoryPopup(category, []);
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
