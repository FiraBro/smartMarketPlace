import { useState } from "react";
import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import Lottie from "lottie-react";
import successAnim from "../../assets/animations/success.json";

export default function SellerProfile() {
  const [form, setForm] = useState({
    shopName: "My Awesome Shop",
    description: "We sell high-quality products with love",
    address: "Dire Dawa, Ethiopia",
    contact: "+251 900 000 000",
    facebook: "",
    instagram: "",
    logo: "",
    banner: "",
  });
  const [saved, setSaved] = useState(false);

  // ✅ Handle file upload (for both logo & banner)
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

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
        <label className="absolute top-4 right-4 bg-white/90 text-gray-700 px-3 py-1 rounded-lg text-sm cursor-pointer shadow hover:bg-gray-100 transition flex items-center gap-1">
          <FaEdit /> Edit Banner
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageUpload(e, "banner")}
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
              className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover bg-gray-50"
            />
            <label
              // className="absolute bottom-0 right-0 bg-[#f9A03f] text-white p-1 rounded-full text-xs cursor-pointer hover:bg-[#faa64d] transition">
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#f9A03f] focus:shadow-[0_0_0_2px_rgba(249,160,63,0.3)] transition duration-200"
            >
              <FaEdit />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "logo")}
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
          {/* Shop Name */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Name
            </label>
            <input
              type="text"
              value={form.shopName}
              onChange={(e) => setForm({ ...form, shopName: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#f9A03f] focus:shadow-[0_0_0_2px_rgba(249,160,63,0.3)] transition duration-200"
              // className="w-full border border-gray-200 focus:border-[#faa64d] focus:ring-0 rounded-lg px-3 py-2 text-sm transition"
              required
            />
          </div>

          {/* Description */}
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
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#f9A03f] focus:shadow-[0_0_0_2px_rgba(249,160,63,0.3)] transition duration-200"

              // className="w-full border border-gray-200 focus:border-[#faa64d] focus:ring-0 rounded-lg px-3 py-2 text-sm transition"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#f9A03f] focus:shadow-[0_0_0_2px_rgba(249,160,63,0.3)] transition duration-200"

              // className="w-full border border-gray-200 focus:border-[#faa64d] focus:ring-0 rounded-lg px-3 py-2 text-sm transition"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact
            </label>
            <input
              type="text"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#f9A03f] focus:shadow-[0_0_0_2px_rgba(249,160,63,0.3)] transition duration-200"

              // className="w-full border border-gray-200 focus:border-[#faa64d] focus:ring-0 rounded-lg px-3 py-2 text-sm transition"
            />
          </div>

          {/* Facebook */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facebook
            </label>
            <input
              type="url"
              value={form.facebook}
              onChange={(e) => setForm({ ...form, facebook: e.target.value })}
              placeholder="https://facebook.com/yourshop"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#f9A03f] focus:shadow-[0_0_0_2px_rgba(249,160,63,0.3)] transition duration-200"

              // className="w-full border border-gray-200 focus:border-[#faa64d] focus:ring-0 rounded-lg px-3 py-2 text-sm transition"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram
            </label>
            <input
              type="url"
              value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              placeholder="https://instagram.com/yourshop"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#f9A03f] focus:shadow-[0_0_0_2px_rgba(249,160,63,0.3)] transition duration-200"

              // className="w-full border border-gray-200 focus:border-[#faa64d] focus:ring-0 rounded-lg px-3 py-2 text-sm transition"
            />
          </div>

          {/* Save Button */}
          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-[#f9A03f] text-white px-6 py-2 rounded-lg hover:bg-[#faa64d] transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Success Notification */}
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
