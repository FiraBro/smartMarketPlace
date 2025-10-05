// src/pages/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import { getOrders } from "../service/orderService";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBox, FaClock, FaCheckCircle } from "react-icons/fa";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-lg text-gray-600">
        Loading your orders...
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <FaBox size={40} className="mb-2 text-gray-400" />
        <p className="text-lg">No orders found</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-3">My Orders</h1>
      <p className="text-gray-600 mb-8">
        💡 Keep your{" "}
        <span className="font-semibold text-blue-600">Order ID</span> safe —
        you’ll need it to track your order.
      </p>

      <div className="space-y-6">
        {orders.map((order, index) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-2xl p-6 border border-gray-100"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Order ID:</span>{" "}
                  <span className="font-mono text-blue-600">{order._id}</span>
                </p>
                <p className="flex items-center text-gray-700">
                  <span className="font-semibold mr-1">Status:</span>
                  {order.status === "Delivered" ? (
                    <span className="flex items-center text-green-600">
                      <FaCheckCircle className="mr-1" /> Delivered
                    </span>
                  ) : (
                    <span className="flex items-center text-yellow-500">
                      <FaClock className="mr-1" /> {order.status || "Pending"}
                    </span>
                  )}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Total Items:</span>{" "}
                  {order.products.length}
                </p>
              </div>

              <div className="mt-4 sm:mt-0">
                <Link
                  to={`/payment/${order._id}`}
                  className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-medium hover:from-blue-500 hover:to-blue-400 transition-all"
                >
                  View / Pay
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
