import React, { useRef, useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaFire,
  FaShoppingBag,
} from "react-icons/fa";
import ProductCard from "./ProductCard";
import { getPopularProducts } from "../service/productService";
import { addToCart } from "../service/cartService";
import Spinner from "./Spinner";

const PopularProducts = () => {
  const carouselRef = useRef(null);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getPopularProducts(12);
        const products = res.items || res || [];
        setPopularProducts(Array.isArray(products) ? products : []);
      } catch (err) {
        console.error("Failed to fetch popular products", err);
        setError("Unable to load popular products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  const scroll = (direction) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollAmount = container.offsetWidth * 0.8; // scroll 80% of container
    let nextScroll =
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

  if (loading)
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-[85rem] mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <Spinner />
          </div>
        </div>
      </section>
    );

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-[85rem] mx-auto relative px-4">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <FaFire className="h-6 w-6 text-orange-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Popular Products
            </h2>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
            <div className="bg-red-50 rounded-full p-4 mb-4">
              <FaExclamationTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to Load Products
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors duration-300 font-medium flex items-center gap-2"
            >
              <FaFire className="h-4 w-4" /> Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!error && popularProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
            <div className="bg-gray-100 rounded-full p-4 mb-4">
              <FaShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Popular Products Yet
            </h3>
            <p className="text-gray-600 mb-2">
              Popular products will appear here as customers start shopping.
            </p>
            <p className="text-gray-500 text-sm">
              Check back later to see what's trending!
            </p>
          </div>
        )}

        {/* Products Carousel */}
        {!error && popularProducts.length > 0 && (
          <>
            {/* Navigation buttons */}
            <button
              onClick={() => scroll("prev")}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 sm:p-3 rounded-full hover:bg-gray-100 transition-all duration-300 z-10 shadow-lg hover:shadow-xl border border-gray-200 hover:scale-105"
            >
              <FaChevronLeft className="h-4 sm:h-5 w-4 sm:w-5 text-gray-700" />
            </button>

            <button
              onClick={() => scroll("next")}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 sm:p-3 rounded-full hover:bg-gray-100 transition-all duration-300 z-10 shadow-lg hover:shadow-xl border border-gray-200 hover:scale-105"
            >
              <FaChevronRight className="h-4 sm:h-5 w-4 sm:w-5 text-gray-700" />
            </button>

            {/* Carousel Container */}
            <div
              ref={carouselRef}
              className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth gap-6 p-4"
            >
              {popularProducts.map((product) => (
                <div
                  key={product._id || product.id}
                  className="flex-shrink-0 snap-start w-[260px] sm:w-[280px] md:w-[300px] lg:w-[320px] transition-transform duration-300 hover:scale-105"
                >
                  <ProductCard
                    product={product}
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

export default PopularProducts;
