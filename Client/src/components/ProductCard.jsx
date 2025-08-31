import React from "react";

export default function ProductCard({ product, onAddToCart }) {
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
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <img
        src={normalized.image}
        alt={normalized.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{normalized.name}</h3>
        <p className="text-gray-600">${normalized.price}</p>
        <div className="flex items-center text-yellow-500 text-sm">
          ⭐ {normalized.rating} ({normalized.reviews} reviews)
        </div>
        <button
          onClick={() => onAddToCart(normalized)}
          className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
