import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addItem } = useCart();

  if (!product) return null;

  // const normalized = {
  //   _id: product._id || product.id,
  //   name: product.title || product.name || "Unnamed Product",
  //   price: product.price || 0,
  //   image: product.images?.[0]?.url
  //     ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${
  //         product.images[0].url
  //       }`
  //     : product.image || "https://via.placeholder.com/200",
  //   placeholder: product.images?.[0]?.placeholder || "", // blur placeholder
  //   rating: product.rating || 0,
  //   reviews: product.reviews || 0,
  // };
  const normalized = {
    _id: product._id || product.id,
    name: product.title || product.name || "Unnamed Product",
    price: product.price || 0,
    image: product.images?.[0]
      ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${
          product.images[0]
        }`
      : "https://via.placeholder.com/200",
    // If your backend does not generate placeholder yet, you can skip or use placeholder image
    placeholder: "https://via.placeholder.com/20",
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(normalized._id, 1);
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
            onClick={(e) => {
              e.stopPropagation();
              addItem(normalized._id, 1);
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
