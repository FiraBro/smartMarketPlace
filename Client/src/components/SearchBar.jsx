import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { searchListings } from "../service/listingService";
import SearchPopup from "./SearchPopup";

export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  // Live search
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim()) {
        try {
          const data = await searchListings(query);
          setResults(data.items || []);
          setShowPopup(true);
        } catch (err) {
          console.error(err);
        }
      } else {
        setResults([]);
        setShowPopup(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Close popup on outside click
  useEffect(() => {
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Navigate to All Listings page
  const handleAllProducts = () => {
    navigate("/listings"); // Adjust this route to your all products page
  };

  return (
    <div className="md:flex flex-1 mx-6 relative" ref={popupRef}>
      <div className="flex w-full border border-gray-300 rounded-full">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-0 flex-1 px-4 py-2 outline-none text-sm rounded-l-full"
        />
        <button
          type="button"
          className="bg-[#f9A03f] px-4 text-white flex items-center justify-center"
        >
          <FaSearch className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={handleAllProducts}
          className="bg-[#e98418] px-4 text-white flex items-center justify-center rounded-r-full hover:bg-[#c46a09] cursor-pointer transition"
        >
          All Products
        </button>
      </div>

      {/* Popup results */}
      <SearchPopup
        results={results}
        showPopup={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
}
