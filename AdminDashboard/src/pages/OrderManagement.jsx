// src/pages/OrderManagement.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import OrderTable from "../components/order/OrderTable";
export default function OrderManagement() {
  const { fetchListings } = useAuth(); // ✅ default to empty array
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  console.log("OrderManagement render - orders:", orders);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      const data = await fetchListings();
      setLoading(false);
      setOrders(data);
    };
    loadOrders();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Orders & Fulfillment
        </h1>
        <div className="flex space-x-3">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            Export Orders
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create Order
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <p className="text-gray-500 text-center py-6">Loading orders...</p>
      ) : (
        <>
          {/* Order Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                label: "Total Orders",
                value: orders.length,
                color: "bg-blue-500",
              },
              {
                label: "Pending",
                value: orders.filter((o) => o.status === "pending").length,
                color: "bg-yellow-500",
              },
              {
                label: "Shipped",
                value: orders.filter((o) => o.status === "shipped").length,
                color: "bg-green-500",
              },
              {
                label: "Cancelled",
                value: orders.filter((o) => o.status === "cancelled").length,
                color: "bg-red-500",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 ${stat.color} rounded-full mr-3`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Table */}
          <OrderTable orders={orders} />
        </>
      )}
    </motion.div>
  );
}
