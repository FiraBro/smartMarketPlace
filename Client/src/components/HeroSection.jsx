import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { getBanners } from "../service/bannerService";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const banners = await getBanners();
        const bannerUrls = banners
          .map(
            (banner) =>
              banner?.image &&
              `${import.meta.env.VITE_STATIC_URL || "http://localhost:5000"}/${
                banner.image
              }`
          )
          .filter(Boolean); // ✅ remove undefined or empty URLs
        setImages(bannerUrls);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      }
    };
    fetchBanners();
  }, []);

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(nextImage, 8000);
      return () => clearInterval(interval);
    }
  }, [images]);

  // ✅ Smooth scroll to category section
  const scrollToCategory = () => {
    const section = document.getElementById("category-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full h-[500px] md:h-[600px] mt-6 overflow-hidden rounded-3xl shadow-xl flex items-center justify-center text-center">
      {/* Background Image */}
      {images.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt="Hero Banner"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        </AnimatePresence>
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg">
          Loading banners...
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-6 sm:px-10 md:px-20">
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 leading-snug max-w-3xl"
        >
          Elevate Your Shopping Experience
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9 }}
          className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-2xl"
        >
          Explore exclusive deals, discover trending products, and experience
          seamless online shopping—all in one destination.
        </motion.p>

        <div className="flex flex-wrap justify-center gap-4">
          {/* 🛍️ Shop Now Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/all-listings")}
            className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-6 sm:px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
          >
            Shop Now
          </motion.button>

          {/* 📂 Browse Categories Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={scrollToCategory}
            className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition-all text-sm sm:text-base"
          >
            Browse Categories
          </motion.button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full hover:bg-white/40 transition"
          >
            <FaChevronLeft size={20} />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full hover:bg-white/40 transition"
          >
            <FaChevronRight size={20} />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full transition-all ${
                idx === currentIndex
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/70"
              }`}
            ></div>
          ))}
        </div>
      )}
    </section>
  );
};
