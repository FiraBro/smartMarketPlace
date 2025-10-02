import React, { useState } from "react";
import { FaPumpSoap, FaRing, FaShoePrints, FaTshirt } from "react-icons/fa";
import ProductCard from "./ProductCard";
import { fetchProductsByCategory } from "../service/categoryService";
import { FaTimes } from "react-icons/fa";

export const CategorySection = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupCategory, setPopupCategory] = useState("");
  const [popupProducts, setPopupProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    {
      icon: <FaPumpSoap />,
      title: "Cosmetics",
      desc: "Makeup & skincare",
      bg: "from-pink-100 to-pink-200",
    },
    {
      icon: <FaRing />,
      title: "Accessories",
      desc: "Jewelry & more",
      bg: "from-yellow-100 to-yellow-200",
    },
    {
      icon: <FaShoePrints />,
      title: "Shoes",
      desc: "Shoes & sandals",
      bg: "from-blue-100 to-blue-200",
    },
    {
      icon: <FaTshirt />,
      title: "Clothing",
      desc: "Trendy outfits",
      bg: "from-green-100 to-green-200",
    },
    {
      icon: <FaTshirt />,
      title: "Electronics",
      desc: "Gadgets & devices",
      bg: "from-gray-100 to-gray-200",
    },
    {
      icon: <FaTshirt />,
      title: "Books",
      desc: "All types of books",
      bg: "from-red-100 to-red-200",
    },
  ];

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map((category, idx) => (
            <div
              key={idx}
              onClick={() => handleCategoryClick(category.title)}
              className="cursor-pointer flex items-center gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div
                className={`p-4 rounded-full bg-gradient-to-br ${category.bg} flex items-center justify-center shadow-md`}
              >
                {category.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg">{category.title}</h3>
                <p className="text-gray-600 text-sm">{category.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup */}
      {popupOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 max-w-4xl p-6 relative">
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
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
