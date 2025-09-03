import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../service/cartService";
export default function ProductCard({ product }) {
  const navigate = useNavigate();

  if (!product) return null;

  // Normalize inside the card itself
  // Normalize inside the card itself
  const normalized = {
    _id: product._id || product.id, // ensure backend gets MongoDB _id
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

  // ✅ Add to cart handler
const handleAddToCart = async (e) => {
  e.stopPropagation(); // prevent navigation when clicking cart button
  try {
    await addToCart(normalized._id, 1); // use _id, not id
    alert(`${normalized.name} added to cart ✅`);
  } catch (error) {
    console.error("Failed to add to cart:", error);
    alert("Something went wrong while adding to cart ❌");
  }
};


  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer w-full h-full flex flex-col"
      onClick={() => navigate(`/listings/${normalized.id}`)}
    >
      {/* Image (fixed height so all equal) */}
      <div className="w-full h-48">
        <img
          src={normalized.image}
          alt={normalized.name}
          className="w-full h-full object-cover rounded-t-2xl"
        />
      </div>

      {/* Content (fills rest of height) */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold">{normalized.name}</h3>

        <div className="flex items-center justify-between text-yellow-500 text-sm mt-1">
          <span>⭐ {normalized.rating}</span>
          <span>({normalized.reviews} reviews)</span>
        </div>

        {/* Price + Cart stays at bottom */}
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
