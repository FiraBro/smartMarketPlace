import React from "react";
import { FaShoppingCart, FaStar, FaPhone, FaEnvelope } from "react-icons/fa";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

const ProductDetail = ({ product, onAddToCart }) => {
  if (!product) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-6">
      {/* Top Section: Image + Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-80 object-cover rounded-lg shadow-md"
          />
          {product.onSale && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded">
              Sale
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    } text-lg`}
                  />
                ))}
                {product.reviews && (
                  <span className="ml-2 text-sm text-gray-500">
                    ({product.reviews} reviews)
                  </span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="flex items-center mb-4">
              <span className="text-2xl font-semibold text-gray-800">
                ETB {product.price}
              </span>
              {product.oldPrice && (
                <span className="ml-3 text-gray-500 line-through">
                  ETB {product.oldPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-4">
              {product.description ||
                "This is a high-quality product carefully selected for you. Perfect for everyday use and guaranteed to satisfy."}
            </p>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center justify-center gap-2 bg-[#F9A03F] text-white px-6 py-3 rounded-lg hover:bg-amber-500 transition"
          >
            <FaShoppingCart /> Add to Cart
          </button>
        </div>
      </div>

      {/* Contact & Social */}
      <div className="mt-8 border-t pt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Seller Information
        </h2>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Contact */}
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-gray-700">
              <FaPhone className="text-[#F9A03F]" />{" "}
              {product.phone || "+251 900 000 000"}
            </p>
            <p className="flex items-center gap-2 text-gray-700">
              <FaEnvelope className="text-[#F9A03F]" />{" "}
              {product.email || "seller@example.com"}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 text-white">
            <a
              href={product.facebook || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href={product.instagram || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-500 p-3 rounded-full hover:bg-pink-600 transition"
            >
              <FaInstagram />
            </a>
            <a
              href={product.twitter || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sky-500 p-3 rounded-full hover:bg-sky-600 transition"
            >
              <FaTwitter />
            </a>
            <a
              href={product.whatsapp || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 p-3 rounded-full hover:bg-green-600 transition"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
