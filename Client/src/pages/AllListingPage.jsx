import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaSearch,
  FaStar,
  FaHeart,
  FaShoppingCart,
  FaTimes,
  FaSlidersH,
  FaFire,
  FaClock,
  FaTag,
  FaShippingFast,
  FaShieldAlt,
  FaSync,
  FaMapMarkerAlt
} from "react-icons/fa";
import { getAllListings } from "../service/listingService";
import { fetchAllCategories } from "../service/categoryService";
import ProductCard from "../components/ProductCard";

// Mock categories and filters
const CATEGORIES = [
  "All Products", "Electronics", "Fashion", "Home & Garden", 
  "Beauty", "Sports", "Books", "Toys", "Automotive"
];

const PRICE_RANGES = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "Over $200", min: 200, max: Infinity }
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" }
];

export default function AllListingsPage() {
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());
  const [quickView, setQuickView] = useState(null);
const [categories, setCategories] = useState(["All Products"]);

// Fetch categories dynamically
useEffect(() => {
  const loadCategories = async () => {
    try {
      const data = await fetchAllCategories(); // fetch from backend
      setCategories(["All Products", ...data]); // prepend "All Products"
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };
  loadCategories();
}, []);

  // Fetch listings
  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllListings(page, limit);
      setListings(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Filter and sort listings
  const filteredAndSortedListings = useMemo(() => {
    let filtered = listings.filter(item => {
      const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All Products" || item.category === selectedCategory;
      const matchesPrice = item.price >= priceRange.min && item.price <= priceRange.max;
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort logic
    switch (sortBy) {
      case "price_low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "popular":
        filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      default:
        // newest first
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  }, [listings, searchQuery, selectedCategory, priceRange, sortBy]);

  // Handlers
  const goPrev = () => setPage((p) => Math.max(p - 1, 1));
  const goNext = () => setPage((p) => Math.min(p + 1, totalPages));

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Products");
    setPriceRange({ min: 0, max: Infinity });
    setSortBy("newest");
  };

  // Quick View Modal
  const QuickViewModal = ({ product, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">{product.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FaTimes />
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative">
            <img 
              src={product.image} 
              alt={product.title}
              className="w-full h-80 object-cover rounded-2xl"
            />
            <button 
              onClick={() => toggleWishlist(product._id)}
              className={`absolute top-4 right-4 p-3 rounded-full ${
                wishlist.has(product._id) 
                  ? "bg-red-500 text-white" 
                  : "bg-white text-gray-600"
              } shadow-lg hover:scale-110 transition-transform`}
            >
              <FaHeart />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < (product.rating || 0) ? "fill-current" : "text-gray-300"} />
                ))}
              </div>
              <span className="text-gray-600">({product.reviewCount || 0} reviews)</span>
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-4">${product.price}</p>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-green-600">
                <FaShippingFast /> Free shipping
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <FaShieldAlt /> 2-year warranty
              </div>
              <div className="flex items-center gap-2 text-purple-600">
                <FaSync /> 30-day returns
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105">
              Add to Cart <FaShoppingCart className="inline ml-2" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <FaSlidersH /> Filters
              </button>
              
              <div className="relative flex-1 lg:w-96">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto justify-between">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-300 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button 
                onClick={clearFilters}
                className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Categories */}
        <div className="overflow-x-auto mb-8">
          <div className="flex gap-2 pb-4 min-w-max">
          {categories.map(category => (
  <button
    key={category}
    onClick={() => setSelectedCategory(category)}
    className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
      selectedCategory === category
        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
    }`}
  >
    {category}
  </button>
))}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="w-80 bg-white/80 backdrop-blur-lg rounded-2xl p-6 h-fit sticky top-24 border border-gray-200"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <FaTimes />
                  </button>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Price Range</h4>
                  <div className="space-y-2">
                    {PRICE_RANGES.map(range => (
                      <button
                        key={range.label}
                        onClick={() => setPriceRange({ min: range.min, max: range.max })}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                          priceRange.min === range.min && priceRange.max === range.max
                            ? "bg-blue-100 text-blue-700 border border-blue-300"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Offers */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Special Offers</h4>
                  <div className="space-y-2">
                    {["Free Shipping", "On Sale", "New Arrivals", "Best Sellers"].map(offer => (
                      <label key={offer} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                        <input type="checkbox" className="rounded text-blue-500" />
                        <span className="flex items-center gap-2">
                          {offer === "On Sale" && <FaFire className="text-orange-500" />}
                          {offer === "New Arrivals" && <FaClock className="text-blue-500" />}
                          {offer === "Best Sellers" && <FaStar className="text-yellow-500" />}
                          {offer}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredAndSortedListings.length} of {listings.length} products
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaMapMarkerAlt />
                <span>Deliver to: only Dire Dawa</span>
              </div>
            </div>

            {/* Loading Skeleton */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                    <div className="bg-gray-300 h-48 rounded-xl mb-4"></div>
                    <div className="bg-gray-300 h-4 rounded mb-2"></div>
                    <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!loading && (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence>
                  {filteredAndSortedListings.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      layout
                    >
                      <ProductCard 
                        product={item} 
                        onWishlistToggle={toggleWishlist}
                        isWishlisted={wishlist.has(item._id)}
                        onQuickView={setQuickView}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* No Results */}
            {!loading && filteredAndSortedListings.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <button 
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center gap-4 mt-12"
              >
                <button
                  onClick={goPrev}
                  disabled={page === 1}
                  className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl border border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg"
                >
                  <FaChevronLeft /> Previous
                </button>
                
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        page === i + 1
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={goNext}
                  disabled={page === totalPages}
                  className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl border border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg"
                >
                  Next <FaChevronRight />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickView && (
          <QuickViewModal 
            product={quickView} 
            onClose={() => setQuickView(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}