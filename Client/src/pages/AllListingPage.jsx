// src/pages/AllListingsPage.jsx
import React, { useEffect, useState } from "react";
import { getAllListings } from "../service/listingService";
import ProductCard from "../components/ProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function AllListingsPage() {
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12); // keep 12 products per page (or any number you like)
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const data = await getAllListings(page, limit);
        console.log("Listings:", data);
        setListings(data.items);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [page, limit]);

  return (
    <div className="container mx-auto px-20 py-8">
      <h1 className="text-3xl font-bold mb-6">All Listings</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          {/* Product Grid - 5 per row on large screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {listings.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="w-12 h-12 flex items-center justify-center 
               bg-gray-100 rounded-full shadow-sm 
               hover:bg-gray-200 transition disabled:opacity-40"
            >
              <FaChevronLeft />
            </button>

            <span className="font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="w-12 h-12 flex items-center justify-center 
               bg-gray-100 rounded-full shadow-sm 
               hover:bg-gray-200 transition disabled:opacity-40"
            >
              <FaChevronRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
