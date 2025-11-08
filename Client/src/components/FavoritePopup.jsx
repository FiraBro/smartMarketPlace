import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiHeart, FiTrash2, FiShoppingCart } from "react-icons/fi";
import { useFavorites } from "../context/FavoriteContext";
import { useCart } from "../context/CartContext";

const FavoritePopup = ({ isOpen, onClose }) => {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
  const { addToCart } = useCart();
  const [selectedItem, setSelectedItem] = useState(null);

  const popupRef = useRef(null);

  const handleAddToCart = (item) => {
    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    });
    setSelectedItem(item._id);
    setTimeout(() => setSelectedItem(null), 2000);
  };

  const totalPrice = favorites
    .reduce((sum, item) => sum + item.price, 0)
    .toFixed(2);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Bottom-up Drawer */}
          <motion.div
            ref={popupRef}
            className="fixed bottom-0 left-0 w-full max-h-[90vh] bg-white z-50 rounded-t-2xl shadow-2xl flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <FiHeart className="w-6 h-6 text-[#f9A03f]" />
                <h2 className="text-xl font-semibold">
                  Favorites ({favorites.length})
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {favorites.length > 0 && (
                  <button
                    onClick={clearFavorites}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 /> Clear All
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Favorites List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {favorites.length === 0 ? (
                <motion.div
                  className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="w-32 h-32 mb-4 flex items-center justify-center bg-rose-50 rounded-full">
                    <FiHeart className="w-12 h-12 text-[#f9A03f] animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Your favorites list is empty
                  </h3>
                  <p className="text-gray-500 mb-4 max-w-xs">
                    Save items you love by clicking the heart icon. They’ll
                    appear here for easy access later.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-[#f9A03f] text-white rounded-xl hover:bg-[#faa64d] transition shadow-md"
                  >
                    Browse Products
                  </button>
                  <p className="text-sm text-gray-400 mt-4">
                    Tip: You can also explore trending products and add them to
                    your favorites!
                  </p>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {favorites.map((item, index) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={itemVariants}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{item.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Br {item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={selectedItem === item._id}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                            selectedItem === item._id
                              ? "bg-green-100 text-green-700 cursor-not-allowed"
                              : "bg-gray-100 hover:bg-rose-500 hover:text-white"
                          }`}
                        >
                          {selectedItem === item._id ? (
                            "Added!"
                          ) : (
                            <>
                              <FiShoppingCart className="inline w-4 h-4 mr-1" />
                              Add
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => removeFromFavorites(item._id)}
                          className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {favorites.length > 0 && (
              <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-gray-700 font-medium">
                  Total: Br {totalPrice}
                </span>
                <button
                  onClick={() => favorites.forEach(handleAddToCart)}
                  className="px-4 py-2 bg-[#f9A03f] text-white rounded-lg hover:bg-[#faa64d] transition"
                >
                  Add All to Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FavoritePopup;
