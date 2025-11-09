// src/components/ProductStatusBadge.jsx
import React from "react";

const statusColors = {
  pending: "bg-gray-300 text-gray-800",
  payment_submitted: "bg-orange-300 text-orange-800",
  funds_held: "bg-yellow-300 text-yellow-800",
  shipped: "bg-blue-300 text-blue-800",
  completed: "bg-green-300 text-green-800",
  disputed: "bg-red-300 text-red-800",
};

const ProductStatusBadge = ({ status }) => {
  return (
    <span
      className={`px-2 py-1 rounded text-sm font-medium ${
        statusColors[status] || "bg-gray-300 text-gray-800"
      }`}
    >
      {status.replace("_", " ").toUpperCase()}
    </span>
  );
};

export default ProductStatusBadge;
