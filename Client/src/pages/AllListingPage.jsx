import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaStar,
  FaHeart,
  FaShoppingCart,
  FaTimes,
  FaSlidersH,
  FaFire,
  FaClock,
  FaShippingFast,
  FaShieldAlt,
  FaSync,
  FaMapMarkerAlt
} from "react-icons/fa";
import { getAllListings } from "../service/listingService";
import { fetchAllCategories } from "../service/categoryService";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";


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
  const navigate = useNavigate()

  // Brand Colors with #f9A03f
  const brandColors = {
    primary: "#f9A03f",    // Orange brand color
    secondary: "#2d3748",  // Dark gray
    accent: "#e53e3e",     // Red
    light: "#f7fafc",      // Light background
    dark: "#1a202c"        // Dark text
  };

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
  const backHome =()=>{
    navigate('/')
  }

  // Quick View Modal
  const QuickViewModal = ({ product, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ 
          duration: 0.4, 
          ease: [0.25, 0.46, 0.45, 0.94],
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{product.title}</h2>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </motion.button>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative">
            <motion.img 
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              src={product.image} 
              alt={product.title}
              className="w-full h-80 object-cover rounded-xl shadow-lg"
            />
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleWishlist(product._id)}
              className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all ${
                wishlist.has(product._id) 
                  ? "bg-red-500 text-white" 
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FaHeart />
            </motion.button>
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
            <p className="text-3xl font-bold text-gray-900 mb-4">${product.price}</p>
            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
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
            <motion.button 
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 10px 25px -5px rgba(249, 160, 63, 0.4)" 
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#f9A03f] hover:bg-[#e89138] text-white py-4 rounded-xl font-bold transition-all duration-300 shadow-lg"
            >
              Add to Cart <FaShoppingCart className="inline ml-2" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/30">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40 shadow-sm"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <motion.button 
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 4px 12px rgba(249, 160, 63, 0.3)" 
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-[#f9A03f] text-white rounded-xl font-semibold transition-all shadow-md"
              >
                <FaSlidersH /> Filters
              </motion.button>
              
              <div className="relative flex-1 lg:w-96">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <motion.input
                  whileFocus={{ boxShadow: "0 0 0 3px rgba(249, 160, 63, 0.1)" }}
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#f9A03f] focus:border-transparent bg-white/80 backdrop-blur-sm transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto justify-between">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-300 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-[#f9A03f] focus:border-transparent transition-all"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                Clear All
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={backHome}
                className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                Back
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Categories - Professional Design */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="overflow-x-auto mb-8"
        >
          <div className="flex gap-3 pb-4 min-w-max">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 border-2 ${
                  selectedCategory === category
                    ? "bg-[#f9A03f] text-white border-[#f9A03f] shadow-lg shadow-orange-500/25"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#f9A03f] hover:text-[#f9A03f]"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="flex gap-8">
          {/* Filters Sidebar - Improved Animation */}
          <AnimatePresence mode="wait">
            {showFilters && (
              <motion.div
                key="filters-sidebar"
                initial={{ 
                  x: -100,
                  opacity: 0,
                  scale: 0.95
                }}
                animate={{ 
                  x: 0,
                  opacity: 1,
                  scale: 1
                }}
                exit={{ 
                  x: -100,
                  opacity: 0,
                  scale: 0.95,
                  transition: {
                    duration: 0.3,
                    ease: "easeInOut"
                  }
                }}
                transition={{ 
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  duration: 0.4
                }}
                className="w-80 bg-white/90 backdrop-blur-lg rounded-2xl p-6 h-fit sticky top-24 border border-gray-200 shadow-xl"
                style={{ 
                  zIndex: 35 
                }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowFilters(false)} 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-gray-500" />
                  </motion.button>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-800">Price Range</h4>
                  <div className="space-y-2">
                    {PRICE_RANGES.map((range, index) => (
                      <motion.button
                        key={range.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 + 0.2 }}
                        whileHover={{ x: 4 }}
                        onClick={() => setPriceRange({ min: range.min, max: range.max })}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all border ${
                          priceRange.min === range.min && priceRange.max === range.max
                            ? "bg-orange-50 text-[#f9A03f] border-orange-300 shadow-sm"
                            : "border-transparent hover:bg-gray-50 hover:border-gray-200"
                        }`}
                      >
                        {range.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Special Offers */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-800">Special Offers</h4>
                  <div className="space-y-2">
                    {["Free Shipping", "On Sale", "New Arrivals", "Best Sellers"].map((offer, index) => (
                      <motion.label 
                        key={offer}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 + 0.3 }}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                      >
                        <input 
                          type="checkbox" 
                          className="rounded text-[#f9A03f] focus:ring-[#f9A03f]" 
                        />
                        <span className="flex items-center gap-2 text-gray-700">
                          {offer === "On Sale" && <FaFire className="text-orange-500" />}
                          {offer === "New Arrivals" && <FaClock className="text-[#f9A03f]" />}
                          {offer === "Best Sellers" && <FaStar className="text-yellow-500" />}
                          {offer === "Free Shipping" && <FaShippingFast className="text-green-500" />}
                          {offer}
                        </span>
                      </motion.label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content with smooth layout adjustment */}
          <motion.div 
            layout
            className="flex-1"
            animate={{
              marginLeft: showFilters ? 0 : 0
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            {/* Results Header */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-between items-center mb-6"
            >
              <p className="text-gray-600 font-medium">
                Showing {filteredAndSortedListings.length} of {listings.length} products
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border border-gray-200">
                <FaMapMarkerAlt className="text-[#f9A03f]" />
                <span>Deliver to: only Dire Dawa</span>
              </div>
            </motion.div>

            {/* Loading Skeleton */}
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-2xl p-4 animate-pulse shadow-sm"
                  >
                    <div className="bg-gray-300 h-48 rounded-xl mb-4"></div>
                    <div className="bg-gray-300 h-4 rounded mb-2"></div>
                    <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Products Grid */}
            {!loading && (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredAndSortedListings.map((item, index) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ 
                        duration: 0.4,
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                      whileHover={{ 
                        y: -5,
                        transition: { duration: 0.2 }
                      }}
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <motion.button 
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 4px 12px rgba(249, 160, 63, 0.3)" 
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="px-6 py-3 bg-[#f9A03f] text-white rounded-xl font-semibold transition-all shadow-md"
                >
                  Clear All Filters
                </motion.button>
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center items-center gap-4 mt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goPrev}
                  disabled={page === 1}
                  className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl border border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                >
                  <FaChevronLeft /> Previous
                </motion.button>
                
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <motion.button
                      key={i + 1}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all border ${
                        page === i + 1
                          ? "bg-[#f9A03f] text-white border-[#f9A03f] shadow-lg shadow-orange-500/25"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#f9A03f] hover:text-[#f9A03f]"
                      }`}
                    >
                      {i + 1}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goNext}
                  disabled={page === totalPages}
                  className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl border border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                >
                  Next <FaChevronRight />
                </motion.button>
              </motion.div>
            )}
          </motion.div>
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