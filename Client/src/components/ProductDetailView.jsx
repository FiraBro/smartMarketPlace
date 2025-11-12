import React, { useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";

export default function ProductDetailView({
  product,
  related,
  isLoading = false,
  error = null,
}) {
  const BASE_URL = import.meta.env.VITE_STATIC_URL || "http://localhost:5000";
  const [mainImage, setMainImage] = useState("");
  const [imageLoading, setImageLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    if (product?.images?.[0]?.url) {
      const imgUrl = `${BASE_URL}${product.images[0].url}`;
      setMainImage(imgUrl);
      const img = new Image();
      img.src = imgUrl;
      img.onload = () => setImageLoading(false);
    }
  }, [product, BASE_URL]);

  const fallbackImage = "https://via.placeholder.com/400";

  if (isLoading)
    return (
      <div className="max-w-6xl mx-auto p-8 animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="w-full aspect-[4/3] bg-gray-200 rounded-2xl"></div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 w-3/4 rounded"></div>
          <div className="h-4 bg-gray-200 w-full rounded"></div>
          <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
          <div className="h-10 bg-gray-200 w-1/3 rounded"></div>
        </div>
      </div>
    );

  if (error || !product)
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-red-700 mb-2">
            Product Not Found
          </h3>
          <p className="text-red-600">
            {error || "The product you’re looking for isn’t available."}
          </p>
        </div>
      </div>
    );

  const handleAddToCart = () => {
    if (!product.inStock) return toast.error("Product is out of stock!");
    if (product.sizes?.length > 0 && !selectedSize)
      return toast.error("Please select a size!");

    addItem(
      {
        id: product._id,
        name: product.title,
        price: product.price,
        image: mainImage || fallbackImage,
        stock: product.stock || 10,
        size: selectedSize,
      },
      1
    );
    toast.success(`${product.title} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // navigate("/checkout"); // optional
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT SIDE - IMAGES */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-lg bg-white/70 backdrop-blur-md border border-gray-100">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin"></div>
              </div>
            )}
            <LazyLoadImage
              src={mainImage || fallbackImage}
              alt={product.title}
              effect="blur"
              className="w-full h-[450px] object-cover transition-transform duration-300 hover:scale-105"
              onLoad={() => setImageLoading(false)}
              onError={(e) => (e.target.src = fallbackImage)}
            />
          </div>

          {/* THUMBNAILS */}
          {product.images?.length > 0 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {product.images.map((img, i) => {
                const imgUrl = img?.url
                  ? `${BASE_URL}${img.url}`
                  : fallbackImage;
                const selected = mainImage === imgUrl;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setMainImage(imgUrl);
                      setImageLoading(true);
                    }}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selected
                        ? "border-amber-600 ring-2 ring-amber-400"
                        : "border-gray-200 hover:border-amber-400"
                    }`}
                  >
                    <LazyLoadImage
                      src={imgUrl}
                      effect="blur"
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/80")
                      }
                    />
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* RIGHT SIDE - DETAILS */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center space-y-6"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h1>
            {product.category && (
              <span className="inline-block mt-2 bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full">
                {product.category}
              </span>
            )}
          </div>

          <p className="text-3xl font-semibold text-amber-600">
            ${product.price?.toFixed(2)}
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">
            {product.description}
          </p>

          <div className="text-sm font-semibold text-gray-700">
            Stock:{" "}
            {product.stock != null ? product.stock : product.inStockQty || 10}
          </div>

          {product.sizes?.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 border rounded-lg transition ${
                    selectedSize === size
                      ? "bg-amber-600 text-white border-amber-600"
                      : "border-gray-300 text-gray-700 hover:border-amber-500"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 bg-amber-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-amber-500 active:scale-95 transition-all duration-150 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-gray-800 active:scale-95 transition-all duration-150 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Buy Now
            </button>
          </div>
        </motion.div>
      </div>

      {/* RELATED PRODUCTS */}
      {related?.length > 0 && (
        <section className="mt-20 border-t border-gray-100 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            You may also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((r) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ProductCard product={r} />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
