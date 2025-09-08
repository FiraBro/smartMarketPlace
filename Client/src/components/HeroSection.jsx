import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { getBanners } from "../service/bannerService"; // ✅ import service

export const HeroSection = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch banners on mount
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const banners = await getBanners();
        // Map to proper image URLs (adjust host if needed)
        const bannerUrls = banners.map(
          (banner) =>
            `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/${
              banner.image
            }`
        );
        setImages(bannerUrls);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      }
    };
    fetchBanners();
  }, []);

  // Next & Prev functions
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

  // Auto scroll every 10s
  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(nextImage, 10000);
      return () => clearInterval(interval);
    }
  }, [images]);

  return (
    <section className="relative bg-gradient-to-r from-[#F9A03F] to-purple-600 text-white py-20 px-4 rounded-2xl mt-10">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        {/* Left Text */}
        <motion.div
          className="md:w-1/2 mb-10 md:mb-0"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to SmartMarketPlace
          </h1>
          <p className="text-xl mb-6">
            Discover amazing products at unbeatable prices
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
              Shop Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>

        {/* Right Image Carousel */}
        <div className="md:w-1/2 relative flex justify-center items-center overflow-hidden">
          {images.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                alt="Hero Slide"
                className="rounded-lg shadow-2xl w-full h-96 object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8 }}
              />
            </AnimatePresence>
          ) : (
            <div className="w-full h-96 flex items-center justify-center bg-gray-200 text-gray-600 rounded-lg">
              Loading banners...
            </div>
          )}

          {/* Left Button */}
          {images.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/70 transition"
            >
              <FaChevronLeft size={20} />
            </button>
          )}

          {/* Right Button */}
          {images.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/70 transition"
            >
              <FaChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
