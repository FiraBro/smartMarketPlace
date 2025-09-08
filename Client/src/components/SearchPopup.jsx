import ProductCard from "./ProductCard";
export default function SearchPopup({
  results,
  showPopup,
  onAddToCart,
  onClose,
}) {
  if (!showPopup) return null;

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[1200px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-[80vh] overflow-y-auto p-6">
      <h2 className="text-xl font-semibold mb-6">Search Results</h2>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((item) => (
            <div
              key={item._id}
              onClick={() => onClose && onClose()} // <-- close popup when clicked
            >
              <ProductCard
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
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-gray-500 text-center">No products found</div>
      )}
    </div>
  );
}
