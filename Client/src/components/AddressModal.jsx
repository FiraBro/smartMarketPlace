import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiPhone, FiMapPin, FiX, FiSave } from "react-icons/fi";
import { createAddress } from "../service/addressService";

const AddressModal = ({ onSave, onCancel }) => {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const savedAddress = await createAddress(form);
      if (onSave) onSave(savedAddress);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onCancel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
          className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-semibold text-gray-800">
              Add Delivery Address
            </h2>
            <button
              onClick={onCancel}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <FiX className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-2 rounded-lg mb-3">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="flex items-center bg-gray-50 px-3 py-2 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-amber-500 transition">
              <FiUser className="text-gray-500 mr-2" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                className="w-full bg-transparent outline-none placeholder-gray-400 text-gray-700"
                required
              />
            </div>

            {/* Phone */}
            <div className="flex items-center bg-gray-50 px-3 py-2 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-amber-500 transition">
              <FiPhone className="text-gray-500 mr-2" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="w-full bg-transparent outline-none placeholder-gray-400 text-gray-700"
                required
              />
            </div>

            {/* Street */}
            <div className="flex items-center bg-gray-50 px-3 py-2 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-amber-500 transition">
              <FiMapPin className="text-gray-500 mr-2" />
              <input
                type="text"
                name="street"
                placeholder="Street / Area / Building"
                value={form.street}
                onChange={handleChange}
                className="w-full bg-transparent outline-none placeholder-gray-400 text-gray-700"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 shadow-sm transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-2.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-amber-400 cursor-not-allowed"
                    : "bg-amber-600 hover:bg-amber-700 transition-all shadow-sm"
                }`}
              >
                <FiSave className="w-4 h-4" />
                {loading ? "Saving..." : "Save Address"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddressModal;
