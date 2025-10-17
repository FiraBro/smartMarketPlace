// src/components/user/BuyerManagement.jsx
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import BuyerTable from "./BuyerTable";
import BuyerFilters from "./BuyerFilters";

export default function BuyerManagement({ buyers }) {
  console.log(buyers);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    dateRange: "all",
    activity: "all",
  });

  // Compute stats dynamically
  const stats = useMemo(() => {
    const total = buyers?.length || 0;
    const activeThisMonth =
      buyers?.filter((b) => b.status === "active").length || 0;
    const suspended =
      buyers?.filter((b) => b.status === "suspended").length || 0;
    const highValue = buyers?.filter((b) => b.totalSpent > 1000).length || 0; // Example threshold
    return [
      { label: "Total Buyers", value: total, color: "bg-blue-500" },
      {
        label: "Active This Month",
        value: activeThisMonth,
        color: "bg-green-500",
      },
      { label: "Suspended", value: suspended, color: "bg-red-500" },
      { label: "High Value", value: highValue, color: "bg-purple-500" },
    ];
  }, [buyers]);

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
        {stats.map((stat, index) => (
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
      <BuyerTable buyers={buyers} filters={filters} />
    </div>
  );
}
