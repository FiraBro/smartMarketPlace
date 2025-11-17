import { useState } from "react";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoriteContext";
import { useAuth } from "../context/AuthContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const [showSizePopup, setShowSizePopup] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  if (!product) return null;

  const normalized = {
    id: product._id || product.id,
    name: product.title || product.name || "Unnamed Product",
    price: product.price || 0,
    image: product.images?.[0]?.url,
    placeholder:
      product.images?.[0]?.placeholder || "https://via.placeholder.com/200",
    rating: product.rating || 0,
    reviews: product.reviews || 0,
    category: product.category || "Clothing",
    sizes: product.sizes || ["Standard"],
    owner: product.owner,

    // ✅ FIX: auto-generate size-wise stock if not provided
    stockPerSize:
      product.stockPerSize && Object.keys(product.stockPerSize).length > 0
        ? product.stockPerSize
        : Object.fromEntries(
            (product.sizes || ["Standard"]).map((size) => [
              size,
              product.stock ?? 0,
            ])
          ),
  };

  const isFavorite = favorites.some((item) => item._id === normalized.id);
  const isMine = normalized.owner === user?._id;

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(normalized.id);
      toast.success("Removed from favorites!");
    } else {
      addToFavorites({ ...normalized, _id: normalized.id });
      toast.success("Added to favorites!");
    }
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    if (isMine) {
      toast.error("You cannot add your own product to the cart.");
      return;
    }

    const totalStock = Object.values(normalized.stockPerSize).reduce(
      (sum, qty) => sum + qty,
      0
    );

    if (totalStock <= 0) {
      toast.error("This product is out of stock!");
      return;
    }

    setShowSizePopup(true); // show size selection
  };

  const handleConfirmAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size!");
      return;
    }

    const stock = normalized.stockPerSize[selectedSize] ?? 0;
    if (stock <= 0) {
      toast.error("Selected size is out of stock!");
      return;
    }

    addItem({ ...normalized, size: selectedSize }, 1);
    toast.success(`${normalized.name} (${selectedSize}) added to cart!`);
    setSelectedSize(null);
    setShowSizePopup(false);
  };

  // Determine size options based on category
  const sizeOptionsMap = {
    Footwear: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    Clothing: ["XS", "S", "M", "L", "XL", "XXL"],
  };
  const sizeOptions = sizeOptionsMap[normalized.category] || normalized.sizes;

  return (
    <>
      <div
        className={`bg-white rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer w-full flex flex-col ${
          isMine ? "opacity-70" : ""
        }`}
        onClick={() => navigate(`/listings/${normalized.id}`)}
      >
        <div className="w-full aspect-[4/3.5] relative overflow-hidden rounded-t-2xl">
          <LazyLoadImage
            src={normalized.image}
            placeholderSrc={normalized.placeholder}
            effect="blur"
            alt={normalized.name}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = "https://via.placeholder.com/200")}
          />
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-red-100 transition"
          >
            <FaHeart
              className={`w-5 h-5 ${
                isFavorite ? "text-red-500" : "text-gray-500"
              }`}
            />
          </button>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold truncate">{normalized.name}</h3>
          <div className="flex items-center justify-between text-yellow-500 text-sm mt-1">
            <span>⭐ {normalized.rating}</span>
            <span>({normalized.reviews} reviews)</span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-[#000] font-bold text-2xl">
              ${normalized.price}
            </p>
            <button
              onClick={handleAddToCartClick}
              disabled={isMine}
              className={`text-yellow-500 hover:text-yellow-700 transition cursor-pointer ${
                isMine
                  ? "cursor-not-allowed opacity-50 hover:text-yellow-500"
                  : ""
              }`}
            >
              <FaShoppingCart />
            </button>
          </div>
        </div>
      </div>

      {/* Size Selection Popup */}
      <AnimatePresence>
        {showSizePopup && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowSizePopup(false);
              setSelectedSize(null);
            }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-[90%] max-w-md flex flex-col gap-6 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-900 text-center">
                Select Size
              </h3>

              <div className="flex flex-wrap gap-3 justify-center">
                {sizeOptions.map((size) => {
                  const stock = normalized.stockPerSize[size] ?? 0;
                  const selected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      disabled={stock <= 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSize(size);
                      }}
                      className={`px-4 py-2 border rounded-lg transition ${
                        selected
                          ? "bg-amber-600 text-white border-amber-600"
                          : "border-gray-300 text-gray-700 hover:border-amber-500"
                      } ${stock <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {size} {stock <= 0 ? "(Out of stock)" : ""}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleConfirmAddToCart}
                className="mt-4 bg-[#f9A03f] text-white py-3 rounded-xl hover:bg-[#faa64d] font-semibold"
              >
                Add to Cart
              </button>

              <button
                onClick={() => {
                  setShowSizePopup(false);
                  setSelectedSize(null);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
