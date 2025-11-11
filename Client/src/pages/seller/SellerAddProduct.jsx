import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { createListing } from "../../service/listingService";
import { toast } from "react-hot-toast";

export default function AddProduct() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    images: [],
    condition: "used",
    location: "",
    sizes: [],
    stock: 1,
  });
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Cosmetic",
    "Footwear",
    "Accessory",
    "Clothing",
    "Electronics",
  ];

  const conditionOptions = ["new", "like-new", "used", "for-parts"];

  const sizeOptionsMap = {
    Footwear: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    Clothing: ["XS", "S", "M", "L", "XL", "XXL"],
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setForm({ ...form, images: files });

    // Generate previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSizeToggle = (size) => {
    setForm((prev) => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.images.length === 0) {
      toast.error("Please upload at least one product image");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("price", form.price);
      formData.append("condition", form.condition);
      formData.append("location", form.location);
      formData.append("stock", form.stock);
      form.sizes.forEach((size) => formData.append("sizes[]", size));

      form.images.forEach((file) => formData.append("images", file));

      const data = await createListing(formData);
      toast.success(`Product ${data.title} added successfully!`);

      setForm({
        title: "",
        description: "",
        category: "",
        price: "",
        images: [],
        condition: "used",
        location: "",
        sizes: [],
        stock: 1,
      });
      setPreview([]);
      setStep(1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product");
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
              <label className="text-gray-600 text-sm mb-1">
                Product Title
              </label>
              <input
                type="text"
                placeholder="Enter product title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col">
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
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value, sizes: [] })
                }
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

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1">Condition</label>
              <select
                value={form.condition}
                onChange={(e) =>
                  setForm({ ...form, condition: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-indigo-500 focus:outline-none"
              >
                {conditionOptions.map((cond, i) => (
                  <option key={i} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1">Location</label>
              <input
                type="text"
                placeholder="Enter product location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-indigo-500 focus:outline-none"
                required
              />
            </div>
          </motion.div>
        )}

        {/* Step 2: Pricing & Stock */}
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

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                min={1}
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Sizes */}
            {form.category && sizeOptionsMap[form.category]?.length > 0 && (
              <div className="flex flex-col">
                <label className="text-gray-600 text-sm mb-1">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizeOptionsMap[form.category].map((size) => {
                    const selected = form.sizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={`px-3 py-1 border rounded-lg transition ${
                          selected
                            ? "bg-amber-600 text-white border-amber-600"
                            : "border-gray-300 text-gray-700 hover:border-amber-500"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
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
