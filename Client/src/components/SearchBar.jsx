import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaChevronDown,
  FaLaptop,
  FaShoePrints,
  FaTshirt,
  FaBook,
  FaRing,
  FaPumpSoap,
} from "react-icons/fa";
import { searchListings } from "../service/listingService";
import SearchPopup from "./SearchPopup";

export default function SearchBar({ onCategorySelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const catRef = useRef(null);
  const popupRef = useRef(null);

  const categories = [
    { title: "All Categories" },
    { title: "Electronics", icon: <FaLaptop /> },
    { title: "Shoes", icon: <FaShoePrints /> },
    { title: "Clothes", icon: <FaTshirt /> },
    { title: "Books", icon: <FaBook /> },
    { title: "Accessories", icon: <FaRing /> },
    { title: "Cosmetics", icon: <FaPumpSoap /> },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live search
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim()) {
        try {
          const data = await searchListings(query, selectedCategory);
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
  }, [query, selectedCategory]);

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

  return (
    <div className="md:flex flex-1 mx-6 relative" ref={popupRef}>
      <div className="relative w-full" ref={catRef}>
        <div className="flex w-full border border-gray-300 rounded-full">
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 border-r border-gray-300 rounded-l-full"
          >
            {selectedCategory}
            <FaChevronDown className="ml-2 w-4 h-4" />
          </button>
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-w-0 flex-1 px-4 py-2 outline-none text-sm"
          />
          <button
            type="button"
            className="bg-[#f9A03f] px-4 text-white flex items-center justify-center rounded-r-full"
          >
            <FaSearch className="w-5 h-5" />
          </button>
        </div>

        {/* Category dropdown */}
        {dropdownOpen && (
          <div className="absolute left-0 top-12 bg-white border border-gray-300 rounded-xl shadow-lg w-52 z-50">
            {categories.map((cat) => (
              <button
                key={cat.title}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.title);
                  setDropdownOpen(false);
                  if (onCategorySelect && cat.title !== "All Categories") {
                    onCategorySelect(cat.title);
                  }
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-1"
              >
                {cat.icon} {cat.title}
              </button>
            ))}
          </div>
        )}
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
