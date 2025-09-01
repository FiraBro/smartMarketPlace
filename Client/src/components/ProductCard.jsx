import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  if (!product) return null;

  // Normalize inside the card itself
  const normalized = {
    id: product._id || product.id,
    name: product.title || product.name || "Unnamed Product",
    price: product.price || 0,
    image: product.images?.[0]
      ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${
          product.images[0]
        }`
      : product.image || "https://via.placeholder.com/200",
    rating: product.rating || 0,
    reviews: product.reviews || 0,
  };

  return (
    // <div
    //   // className="bg-white rounded-lg shadow-md w-60 flex-shrink-0 hover:shadow-2xl transition-shadow duration-300 cursor-pointer"

    //   onClick={() => navigate(`/listings/${normalized.id}`)} // ✅ Correct navigation
    // >
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer w-full"
      onClick={() => navigate(`/listings/${normalized.id}`)}
    >
      <img
        src={normalized.image}
        alt={normalized.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{normalized.name}</h3>
        <div className="flex items-center justify-between text-yellow-500 text-sm">
          <span>⭐ {normalized.rating}</span>
          <span>({normalized.reviews} reviews)</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-[#000] font-bold text-2xl">
            Br {normalized.price}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation(); // ✅ Prevent card click navigation
              onAddToCart(normalized);
            }}
            className="text-yellow-500 hover:text-yellow-700 transition cursor-pointer"
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
}
