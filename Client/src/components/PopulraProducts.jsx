// PopularProducts.js
import React, { useRef } from "react";
import { FaShoppingCart, FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Sample data
const popularProducts = [
  {
    id: 1,
    name: "Smartphone X100",
    price: 45000,
    image: "https://via.placeholder.com/200x200?text=Phone",
  },
  {
    id: 2,
    name: "Laptop Pro 15",
    price: 120000,
    image: "https://via.placeholder.com/200x200?text=Laptop",
  },
  {
    id: 3,
    name: "Wireless Headphones",
    price: 8000,
    image: "https://via.placeholder.com/200x200?text=Headphones",
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
  },
  {
    id: 6,
    name: "Tablet A10",
    price: 25000,
    image: "https://via.placeholder.com/200x200?text=Tablet",
  },
];

const PopularProducts = ({ onAddToCart }) => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.firstChild.offsetWidth + 16; // card width + gap
      carouselRef.current.scrollBy({
        left: direction === "next" ? cardWidth : -cardWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-6 bg-[#fff]">
      <div className="max-w-[85rem] mx-auto  relative">
        <h2 className="text-3xl font-bold mb-6">Popular Products</h2>

        {/* Left Button */}
        <button
          onClick={() => scroll("prev")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition-colors duration-300 z-10"
        >
          <FaArrowLeft className="h-5 w-5" />
        </button>

        {/* Right Button */}
        <button
          onClick={() => scroll("next")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition-colors duration-300 z-10"
        >
          <FaArrowRight className="h-5 w-5" />
        </button>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="flex space-x-6 overflow-hidden scroll-smooth p-4"
        >
          {popularProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md w-60 flex-shrink-0 hover:shadow-2xl transition-shadow duration-300 "
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4 flex flex-col items-start">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-700 font-medium mb-4">
                  ETB {product.price}
                </p>
                <button
                  onClick={() => onAddToCart(product)}
                  className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors duration-300"
                >
                  <FaShoppingCart className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
