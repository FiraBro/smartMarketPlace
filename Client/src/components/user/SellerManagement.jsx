import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import SellerTable from "../../components/user/SellerTable";
import SellerFilters from "../../components/user/SellerFilters";

export default function SellerManagement({ users = [] }) {
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    dateRange: "all",
  });
  console.log(users);
  // Compute stats safely
  const stats = useMemo(() => {
    const list = users || [];
    const total = list.length;
    const pending = list.filter((u) => u.status === "pending").length;
    const suspended = list.filter((u) => u.status === "suspended").length;
    const featured = list.filter((u) => u.isFeatured).length;

    return [
      { label: "Total Sellers", value: total, color: "bg-blue-500" },
      { label: "Pending Approval", value: pending, color: "bg-yellow-500" },
      { label: "Suspended", value: suspended, color: "bg-red-500" },
      { label: "Featured", value: featured, color: "bg-green-500" },
    ];
  }, [users]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Seller Management
          </h2>
          <p className="text-sm text-gray-600">
            Manage seller accounts and onboarding
          </p>
        </div>
        <button className="bg-[#f9A03f] text-white px-4 py-2 rounded-lg hover:bg-[#faa64d] transition-colors">
          Export Report
        </button>
      </div>

      {/* Filters */}
      <SellerFilters filters={filters} onFiltersChange={setFilters} />

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

      {/* Seller Table */}
      {users.length > 0 ? (
        <SellerTable users={users} filters={filters} />
      ) : (
        <div className="text-center text-gray-500 py-10">No sellers found.</div>
      )}
    </div>
  );
}
