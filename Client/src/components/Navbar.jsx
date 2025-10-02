import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { fetchProductsByCategory } from "../service/categoryService";

export default function Navbar({ openCart, openFav, openCategoryPopup }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalFavItems = favorites?.length || 0;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <nav className="bg-white px-4 md:px-6 py-3 shadow-sm relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600 flex-shrink-0">
          <a href="/">
            Nexa<span className="text-[#f9A03f]">Mart</span>
          </a>
        </div>

        {/* Desktop Links + Search */}
        <div className="hidden md:flex flex-1 items-center gap-4">
          <SearchBar
            onCategorySelect={async (category) => {
              try {
                const data = await fetchProductsByCategory(category);
                openCategoryPopup(
                  category,
                  Array.isArray(data.items) ? data.items : []
                );
              } catch (err) {
                console.error(err);
                openCategoryPopup(category, []);
              }
            }}
          />
        </div>

        {/* Icons */}
        <div className="hidden sm:flex items-center gap-4">
          {user ? (
            <>
              <button onClick={openFav} className="relative">
                <FaHeart className="w-6 h-6 text-gray-700 hover:text-red-600 transition" />
                {totalFavItems > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-2 py-0.5">
                    {totalFavItems}
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
      {menuOpen && (
        <div className="sm:hidden mt-2 bg-gray-50 p-4 rounded-lg shadow-lg space-y-2">
          <SearchBar
            onCategorySelect={async (category) => {
              try {
                const data = await fetchProductsByCategory(category);
                openCategoryPopup(
                  category,
                  Array.isArray(data.items) ? data.items : []
                );
              } catch (err) {
                console.error(err);
                openCategoryPopup(category, []);
              }
            }}
          />
        </div>
      )}

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
