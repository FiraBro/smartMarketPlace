import React from "react";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoriteContext"; // ✅ use your context
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function ProductCard({ product }) {
  console.log(product.images);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  if (!product) return null;

  const normalized = {
    _id: product._id || product.id,
    name: product.title || product.name || "Unnamed Product",
    price: product.price || 0,
    image: product.images?.[0]?.url
      ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${
          product.images[0].url
        }`
      : "https://via.placeholder.com/200",
    placeholder:
      product.images?.[0]?.placeholder || "https://via.placeholder.com/20",
    rating: product.rating || 0,
    reviews: product.reviews || 0,
  };

  const isFavorite = favorites.some((item) => item._id === normalized._id);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(normalized._id);
    } else {
      addToFavorites(normalized);
      alert("Added to favorites!");
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(normalized, 1);
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer w-full flex flex-col"
      onClick={() => navigate(`/listings/${normalized._id}`)}
    >
      {/* Image container */}
      <div className="w-full aspect-[4/3.5] relative overflow-hidden rounded-t-2xl">
        <LazyLoadImage
          src={normalized.image}
          placeholderSrc={
            normalized.placeholder || "https://via.placeholder.com/200"
          }
          effect="blur"
          alt={normalized.name}
          className="w-full h-full object-cover"
        />

        {/* ❤️ Favorite Button */}
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
          <p className="text-[#000] font-bold text-2xl">
            Br {normalized.price}
          </p>
          <button
            onClick={handleAddToCart}
            className="text-yellow-500 hover:text-yellow-700 transition cursor-pointer"
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
}
