import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

export default function CustomSelect({ label, options = [], value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  const selected = options.find((opt) => opt.value === value);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="w-full relative" ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div
        className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selected?.label || "Select..."}</span>
        <FiChevronDown
          className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <ul className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg">
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`cursor-pointer px-3 py-2 hover:bg-yellow-400 hover:text-white capitalize flex justify-between items-center ${
                value === opt.value ? "font-semibold bg-yellow-100" : ""
              }`}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
              {value === opt.value && (
                <FiCheck className="ml-2 text-yellow-600" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
