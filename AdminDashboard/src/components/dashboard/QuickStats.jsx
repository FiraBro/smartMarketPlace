// src/components/dashboard/QuickStats.jsx
import React from "react";
import { motion } from "framer-motion";

export default function QuickStats() {
  const stats = [
    {
      label: "Pending Seller Approvals",
      value: 12,
      color: "bg-yellow-100 text-yellow-800",
    },
    { label: "Open Disputes", value: 8, color: "bg-red-100 text-red-800" },
    {
      label: "Low Stock Alerts",
      value: 23,
      color: "bg-orange-100 text-orange-800",
    },
    {
      label: "Products in Moderation",
      value: 45,
      color: "bg-blue-100 text-blue-800",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <span className="text-sm font-medium text-gray-700">
              {stat.label}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${stat.color}`}
            >
              {stat.value}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
