import React, { useRef } from "react";
import ProductCard from "./ProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const MostSoldProductSection = ({ title, icon, onAddToCart }) => {
  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 89.99,
      oldPrice: 129.99,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      rating: 4.5,
      reviews: 124,
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 199.99,
      oldPrice: 249.99,
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      rating: 4.8,
      reviews: 220,
    },
    {
      id: 3,
      name: "Bluetooth Speaker",
      price: 59.99,
      oldPrice: 89.99,
      image:
        "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      rating: 4.3,
      reviews: 98,
    },
    {
      id: 4,
      name: "Gaming Mouse",
      price: 49.99,
      oldPrice: 69.99,
      image:
        "https://images.unsplash.com/photo-1587202372775-98907f9bbdb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      rating: 4.6,
      reviews: 150,
    },
    {
      id: 5,
      name: "Mechanical Keyboard",
      price: 129.99,
      oldPrice: 179.99,
      image:
        "https://images.unsplash.com/photo-1616249804890-10d80a7a3cba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      rating: 4.7,
      reviews: 340,
    },
    {
      id: 6,
      name: "Mechanical Keyboard",
      price: 129.99,
      oldPrice: 179.99,
      image:
        "https://images.unsplash.com/photo-1616249804890-10d80a7a3cba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      rating: 4.7,
      reviews: 340,
    },
  ];

  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (!carouselRef.current) return;

    const container = carouselRef.current;
    const card = container.firstChild;
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
          <h2 className="text-2xl md:text-3xl font-bold">Most Sold Products</h2>
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
        <div ref={carouselRef} className="flex space-x-6 overflow-hidden p-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MostSoldProductSection;
