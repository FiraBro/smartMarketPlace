import React from "react";
import { FaShoppingCart } from "react-icons/fa";

export default function SearchPopup({ results, showPopup, onClose }) {
  if (!showPopup) return null;

  return (
    <div className="absolute top-14 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-3">
      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <img
                src={
                  item.images?.[0]
                    ? `${
                        import.meta.env.VITE_API_URL || "http://localhost:5000"
                      }${item.images[0]}`
                    : "https://via.placeholder.com/50"
                }
                alt={item.title}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) =>
                  (e.currentTarget.src = "https://via.placeholder.com/50")
                }
              />
              <div className="flex flex-col flex-1">
                <p className="font-semibold text-gray-800 line-clamp-1">
                  {item.title}
                </p>
                <p className="text-sm text-gray-500">${item.price}</p>
                <p className="text-xs text-gray-400">{item.category}</p>
                <button className="mt-2 flex items-center gap-2 text-sm text-white bg-[#f9A03f] px-3 py-1 rounded-md hover:bg-orange-600 transition">
                  <FaShoppingCart /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-gray-500 text-center">No products found</div>
      )}
    </div>
  );
}
