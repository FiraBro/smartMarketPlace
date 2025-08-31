import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "./ProductCard";
import { getPopularProducts } from "../service/productService";
const PopularProducts = ({ onAddToCart }) => {
  const carouselRef = useRef(null);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
console.log(popularProducts)
  // Fetch popular products
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const data = await getPopularProducts(12); // you can adjust limit
        // data looks like [{ product: {...}, views: 20 }, ...]
        // console.log(data);
        setPopularProducts(data.map((item) => item.product));
      } catch (err) {
        console.error("Failed to fetch popular products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
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
    <section className="py-6 bg-[#fff]">
      <div className="max-w-[85rem] mx-auto relative">
        <h2 className="text-3xl font-bold mb-6">Popular Products</h2>

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
        <div
          ref={carouselRef}
          className="flex space-x-6 overflow-hidden scroll-smooth p-4"
        >
          {loading ? (
            <p className="text-center w-full">Loading popular products...</p>
          ) : popularProducts.length > 0 ? (
            popularProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))
          ) : (
            <p className="text-center w-full">No popular products found</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
