import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaBars,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";
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

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalFavItems = favorites?.length || 0;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 🔹 Fetch all products
  const handleAllProducts = async () => {
    try {
      const data = await fetchProductsByCategory(""); // empty category = all products
      openCategoryPopup(
        "All Products",
        Array.isArray(data.items) ? data.items : []
      );
    } catch (err) {
      console.error(err);
      openCategoryPopup("All Products", []);
    }
  };

  return (
    <nav className="bg-white px-4 md:px-6 py-3 shadow-sm relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-blue-600 flex-shrink-0 cursor-pointer"
        >
          Lo<span className="text-[#f9A03f]">go</span>
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

        {/* Icons Section */}
        <div className="hidden sm:flex items-center gap-4">
          {user ? (
            <>
              {/* Favorites */}
              <button onClick={openFav} className="relative">
                <FaHeart className="w-6 h-6 text-red-500 hover:text-red-600 transition" />
                {totalFavItems > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-2 py-0.5">
                    {totalFavItems}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button onClick={openCart} className="relative">
                <FaShoppingCart className="w-6 h-6 text-green-600 hover:text-green-700 transition" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs bg-green-600 text-white rounded-full px-2 py-0.5">
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
                    <button
                      onClick={() => navigate("/profile")}
                      className="block w-full text-left px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 cursor-pointer hover:bg-gray-100"
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
                onClick={() => navigate("/auth")}
                className="px-4 py-2 bg-white border rounded-lg text-gray-800 cursor-pointer hover:bg-gray-100"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="px-4 py-2 bg-[#F9A03F] text-white rounded-lg cursor-pointer hover:bg-orange-600"
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

          {!user && (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate("/auth")}
                className="w-full px-4 py-2 bg-white border rounded-lg text-gray-800 hover:bg-gray-100"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="w-full px-4 py-2 bg-[#F9A03F] text-white rounded-lg hover:bg-orange-600"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
