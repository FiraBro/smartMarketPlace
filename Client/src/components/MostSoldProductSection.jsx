import React, { useRef, useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getTopSellingProducts } from "../service/productService";
const MostSoldProductSection = ({ title, icon, onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  // Fetch top selling products
  useEffect(() => {
    const fetchTopSelling = async () => {
      try {
        const data = await getTopSellingProducts();
        setProducts(data.map((item) => item.product));
      } catch (err) {
        console.error("Failed to fetch top selling products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopSelling();
  }, []);

  const scroll = (direction) => {
    if (!carouselRef.current) return;

    const container = carouselRef.current;
    const card = container.firstChild;
    if (!card) return;

    const cardStyle = getComputedStyle(card);
    const cardWidth = card.offsetWidth + parseInt(cardStyle.marginRight);

    // Calculate max scroll
    const maxScroll = container.scrollWidth - container.clientWidth;

    // Calculate next scroll position
    let nextScroll =
      direction === "next"
        ? Math.min(container.scrollLeft + cardWidth, maxScroll)
        : Math.max(container.scrollLeft - cardWidth, 0);

    container.scrollTo({ left: nextScroll, behavior: "smooth" });
  };

  return (
    <section className="py-6 bg-white relative">
      <div className="max-w-[85rem] mx-auto relative">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">
            {title || "Most Sold Products"}
          </h2>
          <a href="#" className="ml-auto text-blue-600 hover:underline">
            View All
          </a>
        </div>

        {/* Left Button */}
        <button
          onClick={() => scroll("prev")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition-colors duration-300 z-10"
        >
          <FaChevronLeft className="h-5 w-5" />
        </button>

        {/* Right Button */}
        <button
          onClick={() => scroll("next")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition-colors duration-300 z-10"
        >
          <FaChevronRight className="h-5 w-5" />
        </button>

        {/* Carousel */}
        <div ref={carouselRef} className="flex space-x-6 overflow-hidden p-4 w-60">
          {loading ? (
            <p className="text-center w-full">
              Loading top selling products...
            </p>
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))
          ) : (
            <p className="text-center w-full">No top selling products found</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default MostSoldProductSection;
