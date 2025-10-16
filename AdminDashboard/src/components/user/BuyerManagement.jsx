// src/components/users/BuyerManagement.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import BuyerTable from "./BuyerTable";
import BuyerFilters from "./BuyerFilters";

export default function BuyerManagement() {
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    dateRange: "all",
    activity: "all",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Buyer Management
          </h2>
          <p className="text-sm text-gray-600">
            Manage buyer accounts and monitor purchasing behavior
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            Export Buyers
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Send Broadcast
          </button>
        </div>
      </div>

      {/* Filters */}
      <BuyerFilters filters={filters} onFiltersChange={setFilters} />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Buyers", value: "23,847", color: "bg-blue-500" },
          { label: "Active This Month", value: "8,452", color: "bg-green-500" },
          { label: "Suspended", value: "12", color: "bg-red-500" },
          { label: "High Value", value: "1,234", color: "bg-purple-500" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center">
              <div className={`w-4 h-4 ${stat.color} rounded-full mr-3`}></div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <BuyerTable filters={filters} />
    </div>
  );
}
