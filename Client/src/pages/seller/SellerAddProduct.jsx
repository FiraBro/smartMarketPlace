import { useState } from "react";
import { motion } from "framer-motion";
import { FaUpload, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { createListing } from "../../service/listingService";
export default function AddProduct() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    images: [],
  });
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "Cosmetic",
    "Footwear",
    "Accessory",
    "Clothing",
    "Electronics",
  ];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: files });

    // Generate previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Prepare FormData for multiple images
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("price", form.price);
      form.images.forEach((file) => formData.append("images", file));

      const data = await createListing(formData);

      alert(`Product "${data.product.name}" added successfully!`);

      // Reset form
      setForm({
        name: "",
        description: "",
        category: "",
        price: "",
        images: [],
      });
      setPreview([]);
      setStep(1);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg w-full max-w-lg mx-auto p-8"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Add New Product
      </h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Step 1: Product Info */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1">Product Name</label>
              <input
                type="text"
                placeholder="Enter product name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-indigo-500 focus:outline-none"
                required
              />
              <label className="text-gray-600 text-sm mb-1">
                Product Description
              </label>
              <input
                type="text"
                placeholder="Enter product description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-indigo-500 focus:outline-none"
                required
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}

        {/* Step 2: Pricing */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1">Price</label>
              <input
                type="number"
                placeholder="Enter price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-indigo-500 focus:outline-none"
                required
              />
            </div>
          </motion.div>
        )}

        {/* Step 3: Images */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
            <label className="text-gray-600 text-sm mb-1">Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-indigo-500 focus:outline-none"
              required
            />
            {preview.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {preview.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`preview-${index}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 cursor-pointer transition"
            >
              <FaArrowLeft /> Back
            </button>
          )}

          {step < 3 && (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto flex items-center gap-2 bg-[#f9A03f] text-white px-4 py-2 rounded-lg hover:bg-[#faa64d] cursor-pointer transition"
            >
              Next <FaArrowRight />
            </button>
          )}

          {step === 3 && (
            <button
              type="submit"
              disabled={loading}
              className="ml-auto bg-[#f9A03f] text-white px-4 py-2 rounded-lg hover:bg-[#faa64d] cursor-pointer transition"
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
}
