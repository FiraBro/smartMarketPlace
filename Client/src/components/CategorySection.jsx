import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import ProductCard from "./ProductCard";
import {
  fetchProductsByCategory,
  fetchAllCategories,
} from "../service/categoryService";

export const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupCategory, setPopupCategory] = useState("");
  const [popupProducts, setPopupProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryClick = async (category) => {
    setPopupCategory(category);
    setPopupOpen(true);
    setLoading(true);
    try {
      const data = await fetchProductsByCategory(category);
      setPopupProducts(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      console.error(err);
      setPopupProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setPopupOpen(false);
    setPopupCategory("");
    setPopupProducts([]);
  };

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Shop by Category
        </h2>

        {/* Categories grid with vertical scroll after fixed height */}
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "400px" }} // 🔹 set max height
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-4">
            {categories.map((category, idx) => (
              <div
                key={idx}
                onClick={() => handleCategoryClick(category)}
                className="cursor-pointer flex items-center gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="p-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-md">
                  {category[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{category}</h3>
                  <p className="text-gray-600 text-sm">Browse {category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popup */}
      {popupOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 max-w-4xl p-6 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-4">{popupCategory}</h2>

            {loading ? (
              <p>Loading...</p>
            ) : popupProducts.length === 0 ? (
              <p>No products in this category.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {popupProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
