import { useState } from "react";
import { motion } from "framer-motion";
import SellerSidebar from "../../components/seller/SellerSidebar";
import SellerNavbar from "../../components/seller/SellerNavbar";

export default function UpdateProduct() {
  const [form, setForm] = useState({
    name: "Sample Product",
    price: 120,
    stock: 15,
    image: "https://via.placeholder.com/150",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Product updated!");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SellerSidebar />
      <div className="flex-1 flex flex-col">
        <SellerNavbar />
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8 max-w-xl"
        >
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Update Product
          </h1>
          {["name", "price", "stock", "image"].map((key) => (
            <div key={key} className="mb-4">
              <label className="block text-gray-600 mb-1 capitalize">
                {key}
              </label>
              <input
                type={key === "price" || key === "stock" ? "number" : "text"}
                name={key}
                value={form[key]}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}
          <button className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700">
            Update
          </button>
        </motion.form>
      </div>
    </div>
  );
}
