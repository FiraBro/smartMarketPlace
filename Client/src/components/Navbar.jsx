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
import { becomeSeller } from "../service/sellerService"; // ✅ import service

export default function Navbar({ openCart, openFav, openCategoryPopup }) {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth(); // ✅ make sure setUser is available in your context
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalFavItems = favorites?.length || 0;

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setProfileOpen(false);
  };

  // ✅ Become a Seller handler
  const handleBecomeSeller = async () => {
    try {
      setLoading(true);
      const res = await becomeSeller();
      alert(res.message || "You are now a seller!");

      // Update role using context method
      await updateUser({ role: "seller" });

      navigate("/seller/dashboard");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-white px-4 md:px-6 py-3 shadow-sm relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo + Become Seller */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => navigate("/")}
            className="text-2xl font-bold text-blue-600 cursor-pointer flex-shrink-0"
          >
            Lo<span className="text-[#f9A03f]">go</span>
          </div>

          {/* ✅ Become a Seller Link (only for logged-in buyers) */}
          {user && user.role === "buyer" && (
            <button
              onClick={handleBecomeSeller}
              disabled={loading}
              className="text-sm font-medium text-blue-600 hover:text-orange-500 cursor-pointer transition-colors"
            >
              {loading ? "Processing..." : "Become a Seller"}
            </button>
          )}
        </div>

        {/* SearchBar (desktop) */}
        <div className="hidden md:flex flex-1 items-center gap-4">
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
        <div className="hidden sm:flex items-center gap-4">
          {user ? (
            <>
              {/* Favorites */}
              <button onClick={openFav} className="relative">
                <FaHeart className="w-6 h-6 text-red-500 hover:text-red-600" />
                {totalFavItems > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-2 py-0.5">
                    {totalFavItems}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button onClick={openCart} className="relative">
                <FaShoppingCart className="w-6 h-6 text-green-600 hover:text-green-700" />
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
                  <FaUserCircle className="w-7 h-7 text-gray-700 hover:text-blue-600" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-50">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setProfileOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      My Profile
                    </button>
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
                onClick={() => navigate("/auth")}
                className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-100"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/auth")}
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
              } catch {
                openCategoryPopup(category, []);
              }
            }}
          />

          <div className="flex flex-col gap-2">
            {user ? (
              <>
                {user.role === "buyer" && (
                  <button
                    onClick={handleBecomeSeller}
                    disabled={loading}
                    className="w-full px-4 py-2 text-blue-600 bg-white border rounded-lg hover:bg-gray-100"
                  >
                    {loading ? "Processing..." : "Become a Seller"}
                  </button>
                )}
                <button
                  onClick={openFav}
                  className="w-full px-4 py-2 bg-white border rounded-lg hover:bg-gray-100"
                >
                  Favorites ({totalFavItems})
                </button>
                <button
                  onClick={openCart}
                  className="w-full px-4 py-2 bg-white border rounded-lg hover:bg-gray-100"
                >
                  Cart ({totalCartItems})
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-red-600 bg-white border rounded-lg hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/auth")}
                  className="w-full px-4 py-2 bg-white border rounded-lg hover:bg-gray-100"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/auth")}
                  className="w-full px-4 py-2 bg-[#F9A03F] text-white rounded-lg hover:bg-orange-600"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
