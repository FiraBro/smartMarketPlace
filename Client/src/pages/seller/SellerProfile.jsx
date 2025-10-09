// src/pages/seller/SellerProfile.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import Lottie from "lottie-react";
import successAnim from "../../assets/animations/success.json";

export default function SellerProfile() {
  const [form, setForm] = useState({
    shopName: "My Awesome Shop",
    description: "We sell high-quality products with love ❤️",
    address: "Addis Ababa, Ethiopia",
    contact: "+251 900 000 000",
    facebook: "",
    instagram: "",
    logo: "",
    banner: "",
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg w-full max-w-4xl mx-auto overflow-hidden"
    >
      {/* Banner */}
      <div className="relative h-48 bg-gradient-to-r from-indigo-400 to-purple-500">
        {form.banner && (
          <img
            src={form.banner}
            alt="Shop Banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <label className="absolute top-4 right-4 bg-white text-gray-700 px-3 py-1 rounded-lg text-sm cursor-pointer shadow hover:bg-gray-100 transition">
          <FaEdit className="inline mr-1" /> Edit Banner
          <input
            type="url"
            className="hidden"
            onChange={(e) => setForm({ ...form, banner: e.target.value })}
          />
        </label>

        {/* Logo */}
        <div className="absolute bottom-[-40px] left-8">
          <div className="relative">
            <img
              src={
                form.logo ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Shop Logo"
              className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full text-xs cursor-pointer hover:bg-indigo-700 transition">
              <FaEdit />
              <input
                type="url"
                className="hidden"
                onChange={(e) => setForm({ ...form, logo: e.target.value })}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="pt-16 pb-8 px-8">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Name
            </label>
            <input
              type="text"
              value={form.shopName}
              onChange={(e) => setForm({ ...form, shopName: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 ring-indigo-500"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows="3"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact
            </label>
            <input
              type="text"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facebook
            </label>
            <input
              type="url"
              value={form.facebook}
              onChange={(e) => setForm({ ...form, facebook: e.target.value })}
              placeholder="https://facebook.com/yourshop"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram
            </label>
            <input
              type="url"
              value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              placeholder="https://instagram.com/yourshop"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 ring-indigo-500"
            />
          </div>

          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-10 right-10 bg-white shadow-lg rounded-2xl p-4 flex items-center gap-2"
        >
          <Lottie animationData={successAnim} className="w-12 h-12" />
          <span className="text-gray-700 font-medium">Profile Updated!</span>
        </motion.div>
      )}
    </motion.div>
  );
}
