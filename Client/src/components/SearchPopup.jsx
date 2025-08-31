import React from "react";
import ProductCard from "./ProductCard";

export default function SearchPopup({
  results,
  showPopup,
  onClose,
  onAddToCart,
}) {
  if (!showPopup) return null;

  return (
    <div className="absolute top-14 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-3">
      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((item) => (
            <ProductCard
              key={item._id}
              product={{
                id: item._id,
                name: item.title,
                price: item.price,
                image: item.images?.[0]
                  ? `${
                      import.meta.env.VITE_API_URL || "http://localhost:5000"
                    }${item.images[0]}`
                  : "https://via.placeholder.com/200",
                rating: item.rating || 0,
                reviews: item.reviews || 0,
              }}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="p-6 text-gray-500 text-center">No products found</div>
      )}
    </div>
  );
}
