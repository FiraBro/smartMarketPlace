// src/pages/OrderManagement.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getAllOrders,
  verifyPayment,
  releaseFunds,
} from "../services/orderService";

export default function OrderManagement() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    const data = await getAllOrders();
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handlers for admin actions
  const handleVerify = async (orderId, productId) => {
    await verifyPayment(orderId, productId);
    fetchOrders();
  };

  const handleRelease = async (orderId, productId) => {
    await releaseFunds(orderId, productId);
    fetchOrders();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 space-y-6"
    >
      <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>

      {loading ? (
        <p className="text-gray-500 text-center py-6">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Buyer</th>
                <th className="px-4 py-2 text-left">Payment Proof</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) =>
                order.products.map((item) => (
                  <tr key={item._id} className="border-b border-gray-200">
                    <td className="px-4 py-2">{order._id}</td>
                    <td className="px-4 py-2">
                      {item.productId?.title || "Unknown"}
                    </td>
                    <td className="px-4 py-2">{item.quantity}</td>
                    <td className="px-4 py-2">${item.price}</td>
                    <td className="px-4 py-2">{order.buyerId?.name}</td>
                    <td className="px-4 py-2">
                      {item.paymentProof?.imageUrl ? (
                        <img
                          src={item.paymentProof.imageUrl}
                          alt="proof"
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      ) : (
                        "No proof"
                      )}
                    </td>
                    <td className="px-4 py-2 capitalize">{item.status}</td>
                    <td className="px-4 py-2 space-x-2">
                      {item.status === "payment_submitted" && (
                        <button
                          onClick={() => handleVerify(order._id, item._id)}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                        >
                          Verify Payment
                        </button>
                      )}
                      {item.status === "completed" && (
                        <button
                          onClick={() => handleRelease(order._id, item._id)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                        >
                          Release Funds
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
