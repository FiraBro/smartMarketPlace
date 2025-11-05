import React, { useState, useEffect } from "react";
import { FaTimes, FaSearch, FaExclamationTriangle, FaShoppingBag, FaSpinner } from "react-icons/fa";
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
  const [error, setError] = useState(null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        setError(null);
        const data = await fetchAllCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError("Unable to load categories. Please try again later.");
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryClick = async (category) => {
    setPopupCategory(category);
    setPopupOpen(true);
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProductsByCategory(category);
      setPopupProducts(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      console.error(err);
      setError(`Failed to load ${category} products. Please try again.`);
      setPopupProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setPopupOpen(false);
    setPopupCategory("");
    setPopupProducts([]);
    setError(null);
  };

  const handleRetryCategories = () => {
    window.location.reload();
  };

  const handleRetryProducts = async () => {
    if (popupCategory) {
      await handleCategoryClick(popupCategory);
    }
  };

  // Generate consistent gradient colors based on category index
  const getCategoryColor = (index) => {
    const colors = [
      "from-blue-100 to-blue-200 text-blue-600",
      "from-green-100 to-green-200 text-green-600",
      "from-purple-100 to-purple-200 text-purple-600",
      "from-orange-100 to-orange-200 text-orange-600",
      "from-pink-100 to-pink-200 text-pink-600",
      "from-teal-100 to-teal-200 text-teal-600",
      "from-indigo-100 to-indigo-200 text-indigo-600",
      "from-red-100 to-red-200 text-red-600",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover products organized by your favorite categories
          </p>
        </div>

        {/* Categories Loading State */}
        {categoriesLoading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="flex flex-col items-center">
              <FaSpinner className="h-8 w-8 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading categories...</p>
            </div>
          </div>
        )}

        {/* Categories Error State */}
        {error && !categoriesLoading && (
          <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-8">
            <div className="bg-red-50 rounded-full p-4 mb-4">
              <FaExclamationTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to Load Categories
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">{error}</p>
            <button
              onClick={handleRetryCategories}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Categories Empty State */}
        {!categoriesLoading && !error && categories.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-8">
            <div className="bg-gray-100 rounded-full p-4 mb-4">
              <FaShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Categories Available
            </h3>
            <p className="text-gray-600">
              Categories will appear here once they are added to the system.
            </p>
          </div>
        )}

        {/* Categories Grid */}
        {!categoriesLoading && !error && categories.length > 0 && (
          <div
            className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            style={{ maxHeight: "500px" }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4 pr-4">
              {categories.map((category, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCategoryClick(category)}
                  className="cursor-pointer flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 group"
                >
                  <div className={`p-4 rounded-full bg-gradient-to-br ${getCategoryColor(idx)} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <span className="font-bold text-lg">{category[0]?.toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {category}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">Browse collection</p>
                  </div>
                  <div className="text-gray-400 group-hover:text-blue-600 transition-colors duration-300">
                    <FaSearch className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Popup Modal */}
      {popupOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[85vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{popupCategory}</h2>
                <p className="text-gray-600 mt-1">Products in this category</p>
              </div>
              <button
                onClick={closePopup}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="flex flex-col items-center">
                    <FaSpinner className="h-8 w-8 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-600">Loading {popupCategory} products...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-red-50 rounded-full p-4 mb-4">
                    <FaExclamationTriangle className="h-12 w-12 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Unable to Load Products
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md">{error}</p>
                  <button
                    onClick={handleRetryProducts}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && popupProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-gray-100 rounded-full p-4 mb-4">
                    <FaShoppingBag className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-gray-600">
                    There are no products available in the {popupCategory} category yet.
                  </p>
                </div>
              )}

              {/* Products Grid */}
              {!loading && !error && popupProducts.length > 0 && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600">
                      Showing {popupProducts.length} product{popupProducts.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {popupProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product}
                        className="transform hover:scale-105 transition-transform duration-300"
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};