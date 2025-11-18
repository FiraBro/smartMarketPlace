// src/components/common/StatusBadge.jsx
import React from "react";

const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
  approved: { color: "bg-green-100 text-green-800", label: "Approved" },
  suspended: { color: "bg-red-100 text-red-800", label: "Suspended" },
  active: { color: "bg-green-100 text-green-800", label: "Active" },
  inactive: { color: "bg-gray-100 text-gray-800", label: "Inactive" },
  shipped: { color: "bg-blue-100 text-blue-800", label: "Shipped" },
  delivered: { color: "bg-green-100 text-green-800", label: "Delivered" },
  cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
  open: { color: "bg-orange-100 text-orange-800", label: "Open" },
  resolved: { color: "bg-green-100 text-green-800", label: "Resolved" },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || {
    color: "bg-gray-100 text-gray-800",
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.label}
    </span>
  );
}
