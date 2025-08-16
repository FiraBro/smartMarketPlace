import React from "react";
import { FiStar, FiShoppingCart } from "react-icons/fi";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-gray-100">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          Sale
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              className={`${
                i < Math.floor(product.rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              } text-sm`}
            />
          ))}
          <span className="text-gray-500 text-sm ml-1">
            ({product.reviews})
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-lg font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">
              ${product.oldPrice.toFixed(2)}
            </span>
          )}
        </div>
        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
