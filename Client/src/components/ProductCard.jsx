import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoriteContext";
import { useAuth } from "../context/AuthContext"; // to get logged-in user
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { toast } from "react-hot-toast";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { user } = useAuth(); // logged-in user
  const { addItem } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  if (!product) return null;

  const baseUrl = import.meta.env.VITE_STATIC_URL || "http://localhost:5000";

  // Normalize image path
  const imagePath = product.images?.[0]?.url || product.image || "";
  const imageUrl = imagePath.startsWith("http")
    ? imagePath
    : `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;

  const normalized = {
    id: product._id || product.id,
    name: product.title || product.name || "Unnamed Product",
    price: product.price || 0,
    image: imageUrl,
    placeholder:
      product.images?.[0]?.placeholder || "https://via.placeholder.com/20",
    rating: product.rating || 0,
    reviews: product.reviews || 0,
  };

  const isFavorite = favorites.some((item) => item._id === normalized.id);
  const isMine = product.owner === user?._id; // check if this product belongs to logged-in user

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

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isMine) {
      toast.error("You cannot add your own product to the cart.");
      return;
    }
    addItem(normalized, 1);
    toast.success(`${normalized.name} added to cart!`);
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer w-full flex flex-col ${
        isMine ? "opacity-70" : ""
      }`}
      onClick={() => navigate(`/listings/${normalized.id}`)}
    >
      {/* Image */}
      <div className="w-full aspect-[4/3.5] relative overflow-hidden rounded-t-2xl">
        <LazyLoadImage
          src={normalized.image}
          placeholderSrc={normalized.placeholder}
          effect="blur"
          alt={normalized.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/200";
          }}
        />
        {/* Favorite Button */}
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

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold truncate">{normalized.name}</h3>

        <div className="flex items-center justify-between text-yellow-500 text-sm mt-1">
          <span>⭐ {normalized.rating}</span>
          <span>({normalized.reviews} reviews)</span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-[#000] font-bold text-2xl">$ {normalized.price}</p>
          <button
            onClick={handleAddToCart}
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
  );
}
