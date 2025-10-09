// src/pages/seller/SellerAddProduct.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import Lottie from "lottie-react";
// import uploadAnim from "../../assets/animations/upload.json";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Product added: ${form.name}`);
    setForm({ name: "", category: "", price: "", image: "" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg w-full max-w-md mx-auto p-8"
    >
      <div className="flex flex-col items-center mb-6">
        {/* <Lottie animationData={uploadAnim} className="w-32 h-32" /> */}
        <h2 className="text-xl font-semibold text-gray-800 mt-2">
          Add New Product
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded-lg px-3 py-2 text-sm focus:ring-2 ring-indigo-500"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border rounded-lg px-3 py-2 text-sm focus:ring-2 ring-indigo-500"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border rounded-lg px-3 py-2 text-sm focus:ring-2 ring-indigo-500"
          required
        />
        <input
          type="url"
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="border rounded-lg px-3 py-2 text-sm focus:ring-2 ring-indigo-500"
          required
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white rounded-lg py-2 mt-2 hover:bg-indigo-700 transition"
        >
          Add Product
        </button>
      </form>
    </motion.div>
  );
}
