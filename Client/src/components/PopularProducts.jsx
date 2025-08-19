import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "./ProductCard"; // import the reusable card

// Sample data
const popularProducts = [
  {
    id: 1,
    name: "Smartphone X100",
    price: 45000,
    image: "https://via.placeholder.com/200x200?text=Phone",
    rating: 4,
    reviews: 120,
    onSale: true,
    oldPrice: 50000,
  },
  {
    id: 2,
    name: "Laptop Pro 15",
    price: 120000,
    image: "https://via.placeholder.com/200x200?text=Laptop",
    rating: 5,
    reviews: 87,
  },
  {
    id: 3,
    name: "Wireless Headphones",
    price: 8000,
    image: "https://via.placeholder.com/200x200?text=Headphones",
    rating: 4,
    reviews: 64,
    onSale: true,
    oldPrice: 10000,
  },
  {
    id: 4,
    name: "Smartwatch Series 5",
    price: 15000,
    image: "https://via.placeholder.com/200x200?text=Watch",
  },
  {
    id: 5,
    name: "Tablet A10",
    price: 25000,
    image: "https://via.placeholder.com/200x200?text=Tablet",
    rating: 3,
    reviews: 15,
  },
  {
    id: 6,
    name: "Tablet A10",
    price: 25000,
    image: "https://via.placeholder.com/200x200?text=Tablet",
    rating: 3,
    reviews: 15,
  },
];

const PopularProducts = ({ onAddToCart }) => {
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
          {popularProducts.map((product) => (
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

export default PopularProducts;
