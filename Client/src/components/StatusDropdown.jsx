import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

export default function StatusDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const options = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const handleSelect = (option) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div className="relative w-full mb-4">
      {/* Selected box */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center border border-gray-100 bg-gray-50/60 
                   rounded-lg p-2 text-gray-700 text-sm focus:outline-none 
                   focus:ring-1 focus:ring-[#faa64d]/40 transition-all duration-200"
      >
        <span>{value}</span>
        <FaChevronDown
          className={`text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown list */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 w-full bg-white border border-gray-100 rounded-lg mt-1 shadow-md overflow-hidden"
          >
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className={`px-4 py-2 text-sm cursor-pointer transition-colors duration-150 ${
                  value === option
                    ? "bg-[#faa64d]/10 text-[#faa64d] font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {option}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
