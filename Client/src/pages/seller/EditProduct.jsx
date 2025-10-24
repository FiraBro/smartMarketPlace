import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getListingById, updateListing } from "../../service/listingService";
import { FaTrash, FaUpload, FaArrowLeft } from "react-icons/fa";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    location: "",
  });
  const [newImages, setNewImages] = useState([]);
  const [removeFiles, setRemoveFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categories = [
    "Cosmetic",
    "Footwear",
    "Accessory",
    "Clothing",
    "Electronics",
  ];
  // ✅ Fetch existing listing
  useEffect(() => {
    (async () => {
      try {
        const data = await getListingById(id);
        setListing(data);
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          condition: data.condition,
          location: data.location,
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleRemoveExisting = (url) => {
    setRemoveFiles((prev) => [...prev, url]);
    setListing((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.url !== url),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const form = new FormData();
      Object.entries(formData).forEach(([key, val]) => form.append(key, val));
      removeFiles.forEach((f) => form.append("removeFiles", f));
      newImages.forEach((img) => form.append("images", img));

      await updateListing(id, form);
      alert("Product updated successfully!");
      navigate("/seller/dashboard");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-500">
        Loading product...
      </div>
    );

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30 backdrop-blur-sm p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-xl p-10 pt-12 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#e2953f]/30">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mt-2">
            Edit Product
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#e2953f] cursor-pointer hover:text-[#d18435] transition"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl px-4 py-2 border border-[#e2953f]/30 focus:ring-2 focus:ring-[#e2953f] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl px-4 py-2 border border-[#e2953f]/30 focus:ring-2 focus:ring-[#e2953f] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl px-4 py-2 border border-[#e2953f]/30 focus:ring-2 focus:ring-[#e2953f] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl px-4 py-2 border border-[#e2953f]/30 focus:ring-2 focus:ring-[#e2953f] outline-none"
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl px-4 py-2 border border-[#e2953f]/30 focus:ring-2 focus:ring-[#e2953f] outline-none"
              >
                <option value="">Select condition</option>
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600">Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl px-4 py-2 border border-[#e2953f]/30 focus:ring-2 focus:ring-[#e2953f] outline-none"
              />
            </div>
          </div>

          {/* Existing Images */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Existing Images
            </label>
            <div className="flex flex-wrap gap-3">
              {listing?.images?.length ? (
                listing.images.map((img) => (
                  <div
                    key={img.url}
                    className="relative w-24 h-24 rounded-xl overflow-hidden shadow-md border border-[#e2953f]/30"
                  >
                    <img
                      src={img.url}
                      alt="listing"
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExisting(img.url)}
                      className="absolute top-1 right-1 bg-[#e2953f] text-white p-1 rounded-full hover:bg-[#d18435]"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic">No images</p>
              )}
            </div>
          </div>

          {/* Add New Images */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Add New Images
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#e2953f]/40 rounded-xl p-6 text-[#e2953f]/70 cursor-pointer hover:border-[#e2953f] hover:text-[#e2953f] transition">
              <FaUpload size={20} />
              <p className="text-sm mt-1">Click to upload images</p>
              <input
                type="file"
                multiple
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>

            {newImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {newImages.map((file, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-24 h-24 rounded-xl object-cover border border-[#e2953f]/30 shadow-md"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            disabled={saving}
            className="w-full mt-6 mb-4 py-3 bg-[#e2953f] text-white font-semibold rounded-xl hover:bg-[#d18435] cursor-pointer transition disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
