import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addItem } = useCart();

  if (!product) return null;

  const normalized = {
    _id: product._id || product.id,
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

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    addItem(normalized._id, 1); // ✅ use context function
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer w-full h-full flex flex-col"
      onClick={() => navigate(`/listings/${normalized._id}`)}
    >
      <div className="w-full h-48">
        <img
          src={normalized.image}
          alt={normalized.name}
          className="w-full h-full object-cover rounded-t-2xl"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold">{normalized.name}</h3>

        <div className="flex items-center justify-between text-yellow-500 text-sm mt-1">
          <span>⭐ {normalized.rating}</span>
          <span>({normalized.reviews} reviews)</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
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
