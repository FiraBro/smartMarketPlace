import React from "react";
import {
  FaShoppingCart,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

const ProductDetailView = ({ product, onAddToCart }) => {
  if (!product) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-10">
      {/* Top Section: Image + Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative group">
          <img
            src={
              product.images?.[0]
                ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${
                    product.images[0]
                  }`
                : "https://via.placeholder.com/400"
            }
            alt={product.name}
            className="w-full h-96 object-cover rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105"
          />
          {product.onSale && (
            <span className="absolute top-3 right-3 bg-red-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow">
              SALE
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center mb-4">
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
                <span className="ml-2 text-sm text-gray-500">
                  {product.reviews
                    ? `(${product.reviews} reviews)`
                    : "No reviews yet"}
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-extrabold text-gray-900">
                ETB {product.price}
              </span>
              {product.oldPrice && (
                <span className="text-lg text-gray-500 line-through">
                  ETB {product.oldPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed mb-6">
              {product.description ||
                "This is a premium quality product, carefully crafted to meet your needs. Perfect for everyday use and guaranteed to satisfy."}
            </p>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center justify-center gap-3 bg-[#F9A03F] text-white font-medium px-8 py-4 rounded-xl shadow hover:bg-amber-500 transition transform hover:scale-[1.02]"
          >
            <FaShoppingCart /> Add to Cart
          </button>
        </div>
      </div>

      {/* Seller Info */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Seller Information
        </h2>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Contact */}
          <div className="space-y-3">
            <p className="flex items-center gap-3 text-gray-700">
              <FaPhone className="text-[#F9A03F]" />{" "}
              {product.phone || "+251 900 000 000"}
            </p>
            <p className="flex items-center gap-3 text-gray-700">
              <FaEnvelope className="text-[#F9A03F]" />{" "}
              {product.email || "seller@example.com"}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            <a
              href={product.facebook || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition shadow"
            >
              <FaFacebookF className="text-white" />
            </a>
            <a
              href={product.instagram || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-500 p-3 rounded-full hover:bg-pink-600 transition shadow"
            >
              <FaInstagram className="text-white" />
            </a>
            <a
              href={product.twitter || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sky-500 p-3 rounded-full hover:bg-sky-600 transition shadow"
            >
              <FaTwitter className="text-white" />
            </a>
            <a
              href={product.whatsapp || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 p-3 rounded-full hover:bg-green-600 transition shadow"
            >
              <FaWhatsapp className="text-white" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
