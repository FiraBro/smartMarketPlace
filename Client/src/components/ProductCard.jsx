import React from "react";
import { FaShoppingCart, FaStar } from "react-icons/fa";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md w-60 flex-shrink-0 hover:shadow-2xl transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {product.onSale && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Sale
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col items-start">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>

        {/* Rating (optional) */}
        {product.rating && (
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                } text-sm`}
              />
            ))}
            {product.reviews && (
              <span className="text-gray-500 text-sm ml-1">
                ({product.reviews})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center mb-4">
          <span className="text-gray-800 font-medium text-lg">
            ETB {product.price}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">
              ETB {product.oldPrice}
            </span>
          )}
        </div>

        {/* Round Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors duration-300"
        >
          <FaShoppingCart className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
