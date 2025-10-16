// src/components/dashboard/MetricCard.jsx
import React from "react";
import { motion } from "framer-motion";

export default function MetricCard({ title, value, change, trend, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p
            className={`text-sm mt-1 ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {change} from last month
          </p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </motion.div>
  );
}
