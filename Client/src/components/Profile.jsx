import React, { useState } from "react";
import {
  FaUserCircle,
  FaShoppingBag,
  FaHeart,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaEdit,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Profile({ openFav }) {
  const { user, logout } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("Updated profile data:", formData);
    // 🚀 Later: send this to backend or update via AuthContext
    setIsEditOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-white shadow-md rounded-2xl p-6">
        <FaUserCircle className="w-24 h-24 text-gray-400" />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800">
            {user?.name || "John Doe"}
          </h2>
          <p className="text-gray-500">{user?.email || "johndoe@email.com"}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <FaEdit className="inline mr-2" />
            Edit
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <FaSignOutAlt className="inline mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* My Orders */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <div className="flex items-center gap-3 mb-4">
            <FaShoppingBag className="text-blue-500 w-6 h-6" />
            <h3 className="text-lg font-semibold text-gray-800">My Orders</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Track, view, or manage your past and current orders.
          </p>
          <a
            href="/orders"
            className="block mt-4 text-blue-600 font-medium hover:underline"
          >
            View Orders →
          </a>
        </div>

        {/* Favorites */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <div className="flex items-center gap-3 mb-4">
            <FaHeart className="text-red-500 w-6 h-6" />
            <h3 className="text-lg font-semibold text-gray-800">
              My Favorites
            </h3>
          </div>
          <p className="text-gray-600 text-sm">
            View and manage your wishlist & saved items.
          </p>
          <button
            onClick={openFav}
            className="block mt-4 text-red-500 font-medium hover:underline"
          >
            View Favorites →
          </button>
        </div>

        {/* Addresses */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <div className="flex items-center gap-3 mb-4">
            <FaMapMarkerAlt className="text-green-500 w-6 h-6" />
            <h3 className="text-lg font-semibold text-gray-800">
              My Addresses
            </h3>
          </div>
          <p className="text-gray-600 text-sm">
            Save or update your delivery addresses.
          </p>
          <a
            href="/addresses"
            className="block mt-4 text-green-600 font-medium hover:underline"
          >
            Manage Addresses →
          </a>
        </div>

        {/* Account Settings */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <div className="flex items-center gap-3 mb-4">
            <FaUserCircle className="text-gray-500 w-6 h-6" />
            <h3 className="text-lg font-semibold text-gray-800">
              Account Settings
            </h3>
          </div>
          <p className="text-gray-600 text-sm">
            Update your profile details and change password.
          </p>
          <a
            href="/settings"
            className="block mt-4 text-gray-700 font-medium hover:underline"
          >
            Go to Settings →
          </a>
        </div>
      </div>

      {/* ✨ Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Edit Profile
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Password (optional)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
