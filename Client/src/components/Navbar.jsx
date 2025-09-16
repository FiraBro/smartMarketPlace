import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaBars,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";
import AuthModal from "./AuthModal";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoriteContext";
import SearchBar from "./SearchBar";

export default function Navbar({ openCart, openFav }) {
  const Navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const handleLogout = () => {
    logout();
    Navigate("/");
  };
  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalFavItems = favorites?.length || 0;

  return (
    <nav className="bg-white px-4 md:px-6 py-3 shadow-sm relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600 flex-shrink-0">
          <a href="/">
            Nexa<span className="text-[#f9A03f]">Mart</span>
          </a>
        </div>

        {/* Search + All Products (Desktop) */}
        <div className="hidden md:flex flex-1 mx-4 items-center gap-3">
          <a
            href="/listings"
            className="text-[#000] hover:text-orange-600 transition"
          >
            All Products &#8594;
          </a>
          <SearchBar />
        </div>

        {/* Desktop Icons */}
        <div className="hidden sm:flex items-center gap-4 relative">
          {user ? (
            <>
              {/* Favorites Icon */}
              <button onClick={openFav} className="relative">
                <FaHeart className="w-6 h-6 text-gray-700 hover:text-red-600 transition" />
                {totalFavItems > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-2 py-0.5">
                    {totalFavItems}
                  </span>
                )}
              </button>

              {/* Cart Icon */}
              <button onClick={openCart} className="relative">
                <FaShoppingCart className="w-6 h-6 text-gray-700" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-2 py-0.5">
                    {totalCartItems}
                  </span>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center"
                >
                  <FaUserCircle className="w-7 h-7 text-gray-700 hover:text-blue-600 transition" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-50">
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
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
          <div className="w-full flex flex-col gap-3">
            {/* 🔥 All Products aligned like Cart/Fav */}
            <a
              href="/products"
              className="flex items-center gap-2 w-full text-left text-[#000] hover:text-orange-600 transition"
            >
              🛍️ All Products
            </a>

            <SearchBar />
          </div>

          {user ? (
            <>
              <button
                onClick={openFav}
                className="flex items-center gap-2 w-full text-left"
              >
                <FaHeart className="text-red-500" /> Favorites ({totalFavItems})
              </button>
              <button
                onClick={openCart}
                className="flex items-center gap-2 w-full text-left"
              >
                <FaShoppingCart className="text-blue-500" /> Cart (
                {totalCartItems})
              </button>
              <a
                href="/profile"
                className="flex items-center gap-2 w-full text-left"
              >
                <FaUserCircle className="text-gray-600" /> My Profile
              </a>
              <button
                onClick={handleLogout}
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
