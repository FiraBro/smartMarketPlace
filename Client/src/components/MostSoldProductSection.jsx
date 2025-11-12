import React, { useRef, useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaShoppingBag,
} from "react-icons/fa";
import ProductCard from "./ProductCard";
import { getTopSellingProducts } from "../service/productService";
import { addToCart } from "../service/cartService";
import Spinner from "./Spinner";

const MostSoldProductSection = () => {
  const carouselRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopSelling = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getTopSellingProducts();
        const data = res.items || res || [];
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch top selling products", err);
        setError("Unable to load trending products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopSelling();
  }, []);

  const scroll = (direction) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollAmount = container.offsetWidth * 0.8; // scroll 80% width
    const nextScroll =
      direction === "next"
        ? container.scrollLeft + scrollAmount
        : container.scrollLeft - scrollAmount;
    container.scrollTo({ left: nextScroll, behavior: "smooth" });
  };

  const handleAddToCart = async (product) => {
    try {
      const listingId = product._id || product.id;
      if (!listingId) return alert("Product ID not found ❌");
      await addToCart(listingId, 1);
      alert(`${product.title || product.name} added to cart ✅`);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Something went wrong while adding to cart ❌");
    }
  };

  const handleRetry = () => window.location.reload();

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-[85rem] mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <Spinner />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-[85rem] mx-auto relative px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Most Sold Products
        </h2>

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
            <div className="bg-red-50 rounded-full p-4 mb-4">
              <FaExclamationTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
            <div className="bg-gray-100 rounded-full p-4 mb-4">
              <FaShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Trending Products
            </h3>
            <p className="text-gray-600 mb-2">
              There are no top-selling products at the moment.
            </p>
            <p className="text-gray-500 text-sm">
              Check back later for popular items.
            </p>
          </div>
        )}

        {/* Products Carousel */}
        {!error && products.length > 0 && (
          <>
            {/* Navigation buttons */}
            <button
              onClick={() => scroll("prev")}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 sm:p-3 rounded-full hover:bg-white transition-all duration-300 z-10 shadow-lg hover:shadow-xl border border-gray-200 hover:scale-105"
            >
              <FaChevronLeft className="h-4 sm:h-5 w-4 sm:w-5 text-gray-700" />
            </button>

            <button
              onClick={() => scroll("next")}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 sm:p-3 rounded-full hover:bg-white transition-all duration-300 z-10 shadow-lg hover:shadow-xl border border-gray-200 hover:scale-105"
            >
              <FaChevronRight className="h-4 sm:h-5 w-4 sm:w-5 text-gray-700" />
            </button>

            {/* Carousel Container */}
            <div
              ref={carouselRef}
              className="flex overflow-x-auto no-scrollbar scroll-smooth gap-6 p-4"
              style={{ minHeight: "420px" }}
            >
              {products.map((product) => (
                <div
                  key={product._id || product.id}
                  className="flex-shrink-0 w-[280px] sm:w-[300px] lg:w-[320px] transition-transform duration-300 hover:scale-105"
                >
                  <ProductCard
                    product={product.product}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default MostSoldProductSection;
