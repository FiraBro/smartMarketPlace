// src/pages/AllListingsPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getAllListings } from "../service/listingService";
import ProductCard from "../components/ProductCard";

export default function AllListingsPage() {
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch listings
  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllListings(page, limit);
      setListings(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Pagination handlers
  const goPrev = () => setPage((p) => Math.max(p - 1, 1));
  const goNext = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">All Listings</h1>

      {/* Listings */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : listings.length === 0 ? (
        <p className="text-center text-gray-500">No listings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {listings.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={goPrev}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-40"
          >
            <FaChevronLeft />
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={goNext}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-40"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
