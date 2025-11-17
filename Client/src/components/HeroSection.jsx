import { useState, useEffect, useCallback } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaShoppingBag,
  FaTags,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getBannersService } from "../service/bannerService";

export const HeroSection = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await getBannersService();
        const bannerUrls = res.data.banners
          .map(
            (banner) => banner?.image && `${banner.image}` // since you already store full Cloudinary URL
          )
          .filter(Boolean);
        setImages(bannerUrls);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      }
    };
    fetchBanners();
  }, []);

  // Use useCallback to prevent unnecessary re-renders
  const nextImage = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToSlide = useCallback(
    (index) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  // Robust auto-slide with proper cleanup
  useEffect(() => {
    if (images.length <= 1) return; // No auto-slide if only one image

    let intervalId;

    const startAutoSlide = () => {
      intervalId = setInterval(() => {
        nextImage();
      }, 5000); // Change slide every 5 seconds
    };

    if (!isPaused) {
      startAutoSlide();
    }

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [images.length, isPaused, nextImage]); // Include nextImage in dependencies

  // Preload next image for smoother transitions
  useEffect(() => {
    if (images.length > 0) {
      const nextIndex = (currentIndex + 1) % images.length;
      const img = new Image();
      img.src = images[nextIndex];
    }
  }, [currentIndex, images]);

  const scrollToCategory = () => {
    const section = document.getElementById("category-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Enhanced slide variants for professional animation
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.1,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  // Reset progress bar animation when slide changes
  const progressBarKey = `${currentIndex}-${Date.now()}`;

  return (
    <section
      className="relative w-full h-[500px] md:h-[700px] mt-6 overflow-hidden rounded-3xl shadow-2xl flex items-center justify-center text-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Background Images with Enhanced Animation */}
      {images.length > 0 ? (
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.8 },
              scale: { duration: 0.8 },
            }}
            className="absolute inset-0 w-full h-full"
          >
            <motion.img
              src={images[currentIndex]}
              alt="Hero Banner"
              className="absolute inset-0 w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 10 }}
            />

            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30"></div>

            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/60"></div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">
              Loading amazing deals...
            </p>
          </motion.div>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center text-white px-6 sm:px-10 md:px-20 max-w-6xl mx-auto">
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 mb-4"
          >
            <FaShoppingBag className="text-orange-400" />
            <span className="text-sm font-semibold">
              Premium Shopping Experience
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight"
          >
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              Elevate Your
            </span>
            <br />
            <span className="text-white">Shopping Experience</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl md:text-3xl text-gray-200 font-light max-w-4xl leading-relaxed"
          >
            Discover{" "}
            <span className="text-orange-300 font-semibold">
              exclusive deals
            </span>
            , trending products, and seamless shopping—all in one destination.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            {/* Primary Button */}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(249, 115, 22, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/all-listings")}
              className="group bg-gradient-to-r from-orange-500 to-pink-600 text-white px-8 sm:px-10 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-xl transition-all duration-300 text-lg flex items-center gap-3"
            >
              <FaShoppingBag className="group-hover:scale-110 transition-transform" />
              Shop Now
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>

            {/* Secondary Button */}
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToCategory}
              className="group border-2 border-white/80 text-white px-8 sm:px-10 py-4 rounded-2xl font-bold backdrop-blur-sm hover:backdrop-blur-md transition-all duration-300 text-lg flex items-center gap-3"
            >
              <FaTags className="group-hover:rotate-12 transition-transform" />
              Browse Categories
            </motion.button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-300"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Free Shipping Over $50
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              24/7 Customer Support
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              Secure Payment
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Navigation Arrows */}
      {images.length > 1 && (
        <>
          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgba(255,255,255,0.3)",
            }}
            whileTap={{ scale: 0.9 }}
            onClick={prevImage}
            aria-label="Previous image"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-lg text-white p-3 sm:p-4 rounded-2xl hover:bg-white/30 transition-all duration-300 shadow-2xl z-30 border border-white/20"
          >
            <FaChevronLeft size={24} />
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgba(255,255,255,0.3)",
            }}
            whileTap={{ scale: 0.9 }}
            onClick={nextImage}
            aria-label="Next image"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-lg text-white p-3 sm:p-4 rounded-2xl hover:bg-white/30 transition-all duration-300 shadow-2xl z-30 border border-white/20"
          >
            <FaChevronRight size={24} />
          </motion.button>
        </>
      )}

      {/* Enhanced Slide Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
          {images.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => goToSlide(idx)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`relative rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              style={{
                width: idx === currentIndex ? "24px" : "12px",
                height: "12px",
              }}
            >
              {idx === currentIndex && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Progress Bar - Only show when auto-slide is active */}
      {images.length > 1 && !isPaused && (
        <motion.div
          key={progressBarKey}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-pink-600 z-30"
        />
      )}

      {/* Auto-slide status indicator */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 z-30">
          <div
            className={`w-3 h-3 rounded-full ${
              isPaused ? "bg-yellow-400" : "bg-green-400"
            } shadow-lg`}
            title={isPaused ? "Auto-slide paused" : "Auto-slide active"}
          />
        </div>
      )}
    </section>
  );
};
