// src/components/Navbar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSearch,
  FaChevronDown,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoriteContext";
import SearchBar from "./SearchBar";
import { fetchProductsByCategory } from "../service/categoryService";
import NotificationList from "../components/NotificationList";
import { useNotification } from "../context/NotificationContext";

export default function Navbar({ openCart, openFav, openCategoryPopup }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
    const { unreadCount } = useNotification();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalFavItems = favorites?.length || 0;

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setProfileOpen(false);
  };

  return (
    <nav className="bg-white px-4 md:px-8 py-4 shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
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

        {/* SearchBar (desktop) */}
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

        {/* Actions (desktop) */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <>
              {/* Mobile Search Toggle */}
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="lg:hidden p-3 text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300"
              >
                <FaSearch className="w-5 h-5" />
              </button>

              {/* Favorites */}
              <button 
                onClick={openFav} 
                className="relative p-3 text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 group"
              >
                <FaHeart className="w-6 h-6 group-hover:scale-110 transition-transform duration-300 group-hover:text-rose-500" />
                {totalFavItems > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs bg-rose-500 text-white rounded-full px-1.5 py-0.5 min-w-[20px] text-center shadow-lg">
                    {totalFavItems}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button 
                onClick={openCart} 
                className="relative p-3 text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 group"
              >
                <FaShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-300 group-hover:text-emerald-600" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs bg-emerald-500 text-white rounded-full px-1.5 py-0.5 min-w-[20px] text-center shadow-lg">
                    {totalCartItems}
                  </span>
                )}
              </button>

              {/* Notifications */}
              {unreadCount > 0 && (   // <-- only show bell if there are notifications
                <div className="relative">
                  <NotificationList userType={user.role} />
                </div>
              )}

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded-2xl transition-all duration-300 group border border-gray-200"
                >
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-1.5 rounded-full">
                    <FaUserCircle className="w-5 h-5 text-white" />
                  </div>
                  <FaChevronDown className={`w-3 h-3 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white shadow-2xl rounded-xl py-3 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">Welcome back!</p>
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
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
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/auth")}
                className="px-6 py-2.5 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium hover:border-gray-400"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transition-all duration-300 font-semibold hover:scale-105"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="sm:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="lg:hidden mt-4 px-2 animate-slideDown">
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
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden mt-4 bg-white rounded-2xl p-6 shadow-2xl border border-gray-200 animate-slideDown">
          {/* User Info */}
          {user && (
            <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-full">
                <FaUserCircle className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Welcome!</p>
                <p className="text-sm text-gray-600 truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
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

          {/* Action Buttons */}
          <div className="space-y-3">
            {user ? (
              <>
                <button
                  onClick={() => {
                    openFav();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-4 bg-rose-50 border border-rose-200 rounded-xl hover:shadow-md transition-all duration-300 group"
                >
                  <span className="font-semibold text-rose-700">❤️ Favorites</span>
                  {totalFavItems > 0 && (
                    <span className="bg-rose-500 text-white px-2.5 py-1 rounded-full text-sm font-medium">
                      {totalFavItems}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    openCart();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl hover:shadow-md transition-all duration-300 group"
                >
                  <span className="font-semibold text-emerald-700">🛒 Cart</span>
                  {totalCartItems > 0 && (
                    <span className="bg-emerald-500 text-white px-2.5 py-1 rounded-full text-sm font-medium">
                      {totalCartItems}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    navigate("/profile");
                    setMenuOpen(false);
                  }}
                  className="w-full text-left p-4 bg-amber-50 border border-amber-200 rounded-xl hover:shadow-md transition-all duration-300 text-amber-900 font-semibold"
                >
                   My Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left p-4 bg-red-50 border border-red-200 rounded-xl hover:shadow-md transition-all duration-300 text-red-600 font-semibold"
                >
                   Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/auth");
                    setMenuOpen(false);
                  }}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 font-semibold text-gray-700"
                >
                   Login
                </button>
                <button
                  onClick={() => {
                    navigate("/auth");
                    setMenuOpen(false);
                  }}
                  className="w-full p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-md transition-all duration-300 font-semibold"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}