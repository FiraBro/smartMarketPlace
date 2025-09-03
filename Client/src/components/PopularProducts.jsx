import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight ,FaShoppingCart} from "react-icons/fa";
import ProductCard from "./ProductCard";
import { getPopularProducts } from "../service/productService";

const PopularProducts = ({ onAddToCart }) => {
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

  const scroll = (direction) => {
    if (!carouselRef.current) return;

    const container = carouselRef.current;
    const card = container.firstChild;
    if (!card) return;

    const cardStyle = getComputedStyle(card);
    const cardWidth = card.offsetWidth + parseInt(cardStyle.marginRight);

    // scroll one card at a time
    let nextScroll =
      direction === "next"
        ? container.scrollLeft + cardWidth
        : container.scrollLeft - cardWidth;

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
          className="flex overflow-hidden scroll-smooth p-4"
          style={{ minHeight: "380px" }} // ensures carousel has a base height
        >
          {loading ? (
            <p className="text-center w-full">Loading popular products...</p>
          ) : popularProducts.length > 0 ? (
            popularProducts.map((product) => (
              <div
                key={product._id}
                className="flex-shrink-0 w-[20%] px-3 flex"
              >
                {/* Card fills parent */}
                <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col w-full h-full">
                  <img
                    src={
                      product.images?.[0]
                        ? `${
                            import.meta.env.VITE_API_URL ||
                            "http://localhost:5000"
                          }${product.images[0]}`
                        : "https://via.placeholder.com/200"
                    }
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-t-2xl"
                  />

                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold">{product.title}</h3>
                    <div className="flex items-center justify-between text-yellow-500 text-sm mt-1">
                      <span>⭐ {product.rating || 0}</span>
                      <span>({product.reviews || 0} reviews)</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <p className="text-[#000] font-bold text-2xl">
                        Br {product.price}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className="text-yellow-500 hover:text-yellow-700 transition cursor-pointer"
                      >
                        <FaShoppingCart />
                      </button>
                    </div>
                  </div>
                </div>
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
