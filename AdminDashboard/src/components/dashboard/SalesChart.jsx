// src/components/dashboard/SalesChart.jsx
import React from "react";
import { motion } from "framer-motion";

export default function SalesChart() {
  const salesData = [
    { month: "Jan", sales: 40000, revenue: 12000 },
    { month: "Feb", sales: 30000, revenue: 9000 },
    { month: "Mar", sales: 50000, revenue: 15000 },
    { month: "Apr", sales: 45000, revenue: 13500 },
    { month: "May", sales: 60000, revenue: 18000 },
    { month: "Jun", sales: 55000, revenue: 16500 },
  ];

  const maxSales = Math.max(...salesData.map((d) => d.sales));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trends</h3>
      <div className="space-y-4">
        {/* Chart bars */}
        <div className="flex items-end justify-between h-48">
          {salesData.map((data, index) => (
            <div
              key={data.month}
              className="flex flex-col items-center flex-1 mx-1"
            >
              <div className="flex items-end space-x-1 h-40">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: (data.sales / maxSales) * 160 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="w-6 bg-blue-500 rounded-t"
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: (data.revenue / maxSales) * 160 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  className="w-6 bg-green-500 rounded-t"
                />
              </div>
              <span className="text-xs text-gray-600 mt-2">{data.month}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">GMV</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Revenue</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
