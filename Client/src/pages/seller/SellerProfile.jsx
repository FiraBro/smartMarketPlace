import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import Lottie from "lottie-react";
import successAnim from "../../assets/animations/success.json";
import {
  getSellerProfile,
  updateSellerProfile,
} from "../../service/sellerService";

export default function SellerProfile() {
  const [form, setForm] = useState({
    shopName: "",
    description: "",
    address: "",
    contact: "",
    logo: "",
    banner: "",
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getSellerProfile();
        setForm({
          shopName: data.shopName || "",
          description: data.description || "",
          address: data.address || "",
          contact: data.contact || "",
          logo: data.logo
            ? `${import.meta.env.VITE_STATIC_URL}${data.logo}`
            : "",
          banner: data.banner
            ? `${import.meta.env.VITE_STATIC_URL}${data.banner}`
            : "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle image selection
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, [type]: file }));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("shopName", form.shopName);
      formData.append("description", form.description);
      formData.append("address", form.address);
      formData.append("contact", form.contact);

      // Only append files if they are new uploads
      if (form.logo instanceof File) formData.append("logo", form.logo);
      if (form.banner instanceof File) formData.append("banner", form.banner);

      await updateSellerProfile(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500">Loading profile...</p>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg w-full max-w-4xl mx-auto overflow-hidden"
    >
      {/* Banner & Logo */}
      <div className="relative h-48 bg-gradient-to-r from-indigo-400 to-purple-500">
        {form.banner && (
          <img
            src={
              form.banner instanceof File
                ? URL.createObjectURL(form.banner)
                : form.banner
            }
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

        <div className="absolute bottom-[-40px] left-8">
          <div className="relative">
            <img
              src={
                form.logo instanceof File
                  ? URL.createObjectURL(form.logo)
                  : form.logo ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Shop Logo"
              className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover bg-gray-50"
            />
            <label className="absolute bottom-0 right-0 bg-white/90 text-gray-700 px-2 py-1 rounded-full text-xs cursor-pointer shadow hover:bg-gray-100 transition">
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
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Name
            </label>
            <input
              type="text"
              value={form.shopName}
              onChange={(e) => setForm({ ...form, shopName: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#f9A03f] transition duration-200"
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
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#f9A03f] transition duration-200"
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
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#f9A03f] transition duration-200"
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
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-[#f9A03f] transition duration-200"
            />
          </div>

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
