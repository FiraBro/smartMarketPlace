// src/components/ProSpinner.jsx
import React from "react";

export default function ProSpinner() {
  return (
    <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin-slow border-t-transparent"></div>
        <div className="absolute inset-0 border-4 border-yellow-500 rounded-full animate-spin-slow-reverse border-b-transparent"></div>
      </div>
    </div>
  );
}
