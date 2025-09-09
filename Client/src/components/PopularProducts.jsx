import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "./ProductCard";
import { getPopularProducts } from "../service/productService";
import { addToCart } from "../service/cartService";
import Spinner from "./Spinner";

const PopularProducts = () => {
  const carouselRef = useRef(null);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const products = await getPopularProducts(12);
        setPopularProducts(products.map((item) => item.product));
      } catch (err) {
        console.error("Failed to fetch popular products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  if (loading) {
    return <Spinner />; 
  }

  const scroll = (direction) => {
    if (!carouselRef.current) return;

    const container = carouselRef.current;
    const card = container.firstChild;
    if (!card) return;

    const cardStyle = getComputedStyle(card);
    const cardWidth = card.offsetWidth + parseInt(cardStyle.marginRight);

    let nextScroll =
      direction === "next"
        ? container.scrollLeft + cardWidth
        : container.scrollLeft - cardWidth;

    container.scrollTo({ left: nextScroll, behavior: "smooth" });
  };

  const handleAddToCart = async (product) => {
    try {
      const listingId = product._id || product.id;
      if (!listingId) {
        console.error("Product missing ID:", product);
        return alert("Product ID not found ❌");
      }

      await addToCart(listingId, 1);
      alert(`${product.title || product.name} added to cart ✅`);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Something went wrong while adding to cart ❌");
    }
  };

  return (
    <section className="py-6 bg-white">
      <div className="max-w-[85rem] mx-auto relative px-4">
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
          className="flex overflow-hidden scroll-smooth p-2"
          style={{ minHeight: "380px" }}
        >
          {loading ? (
            <p className="text-center w-full">Loading popular products...</p>
          ) : popularProducts.length > 0 ? (
            popularProducts.map((product) => (
              <div
                key={product._id}
                className="flex-shrink-0 px-3 flex 
                  w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
              >
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </div>
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
