import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function ProductDetailView({
  product,
  related,
  onAddToCart,
  isLoading = false,
  error = null,
}) {
  const BASE_URL = import.meta.env.VITE_STATIC_URL || "http://localhost:5000";
  const [mainImage, setMainImage] = useState("");
  const [imageLoading, setImageLoading] = useState(true);

  // Set main image when product loads
  useEffect(() => {
    if (product?.images?.[0]?.url) {
      const imgUrl = `${BASE_URL}${product.images[0].url}`;
      setMainImage(imgUrl);
      // Preload main image
      const img = new Image();
      img.src = imgUrl;
      img.onload = () => setImageLoading(false);
    }
  }, [product, BASE_URL]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image skeleton */}
          <div className="flex flex-col">
            <div className="flex gap-3 overflow-x-auto mb-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"
                ></div>
              ))}
            </div>
            <div className="w-full aspect-[4/3] bg-gray-200 rounded-2xl"></div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            <div className="flex gap-4 mt-8">
              <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
              <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <svg
            className="w-12 h-12 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Product Not Available
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
          <svg
            className="w-12 h-12 text-yellow-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            No Product Found
          </h3>
          <p className="text-yellow-600">
            The product you're looking for is not available.
          </p>
        </div>
      </div>
    );
  }

  const fallbackImage = "https://via.placeholder.com/400";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Left: Image gallery - with adjusted width */}
        <div className="flex flex-col lg:max-w-md">
          {/* Main image with loading state */}
          <div className="w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md bg-gray-100 relative mb-5">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
              </div>
            )}
            <LazyLoadImage
              src={mainImage || fallbackImage}
              alt={product.title}
              effect="blur"
              className="w-full h-full object-cover transition-opacity duration-300"
              style={{ opacity: imageLoading ? 0 : 1 }}
              onLoad={() => setImageLoading(false)}
              onError={(e) => {
                e.target.src = fallbackImage;
                setImageLoading(false);
              }}
            />
          </div>

          {/* Thumbnail gallery */}
          {product.images?.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => {
                const imgUrl = img?.url
                  ? `${BASE_URL}${img.url}`
                  : fallbackImage;
                const isSelected = mainImage === imgUrl;

                return (
                  <button
                    key={i}
                    className={`w-16 h-16 border-2 rounded-lg overflow-hidden flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all
                      ${
                        isSelected
                          ? "border-amber-600 ring-2 ring-amber-500"
                          : "border-gray-300"
                      } 
                      hover:border-amber-500`}
                    onClick={() => {
                      setMainImage(imgUrl);
                      setImageLoading(true);
                    }}
                    aria-label={`View ${product.title} thumbnail ${i + 1}`}
                    aria-current={isSelected ? "true" : "false"}
                  >
                    <LazyLoadImage
                      src={imgUrl}
                      alt=""
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
        </div>

        {/* Right: Product info */}
        <div className="flex flex-col">
          <div className="flex-1 space-y-5">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              {product.category && (
                <span className="inline-block bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">
                  {product.category}
                </span>
              )}
            </div>

            <p className="text-xl font-semibold text-amber-600">
              $
              {typeof product.price === "number"
                ? product.price.toFixed(2)
                : product.price}
            </p>

            <div className="prose text-gray-600">
              <p>{product.description}</p>
            </div>

            {product.inStock !== undefined && (
              <div
                className={`text-sm font-medium ${
                  product.inStock ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onAddToCart(product)}
              disabled={product.inStock === false}
              className="flex-1 py-3 px-6 bg-amber-600 text-white rounded-xl shadow-sm hover:bg-amber-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add to Cart
            </button>
            <button
              disabled={product.inStock === false}
              className="flex-1 py-3 px-6 bg-gray-900 text-white rounded-xl shadow-sm hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related?.length > 0 && (
        <section className="mt-16" aria-labelledby="related-products">
          <div className="border-t border-gray-200 pt-12">
            <h2
              id="related-products"
              className="text-2xl font-bold text-gray-900 mb-8"
            >
              You may also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((r) => (
                <ProductCard key={r._id} product={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
