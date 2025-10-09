import { useState } from "react";
import { motion } from "framer-motion";
import { FaShippingFast, FaCheckCircle, FaClock, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

export default function SellerOrders() {
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderId: "#ORD-1001",
      product: "Nike Air Max",
      buyer: "John Doe",
      status: "Pending",
      total: 120,
    },
    {
      id: 2,
      orderId: "#ORD-1002",
      product: "Adidas Hoodie",
      buyer: "Jane Smith",
      status: "Shipped",
      total: 90,
    },
    {
      id: 3,
      orderId: "#ORD-1003",
      product: "Apple Watch Series 8",
      buyer: "Ali Hassan",
      status: "Delivered",
      total: 380,
    },
  ]);

  const handleStatusUpdate = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
    toast.success(`Order status updated to ${newStatus}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600 bg-yellow-50";
      case "Shipped":
        return "text-blue-600 bg-blue-50";
      case "Delivered":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 sm:p-6 md:p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Orders</h2>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="text-gray-500 text-sm border-b border-gray-200">
                  <th className="py-2 px-2">Order ID</th>
                  <th className="py-2 px-2">Product</th>
                  <th className="py-2 px-2">Buyer</th>
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-2">Total</th>
                  <th className="py-2 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: order.id * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50 text-sm"
                  >
                    <td className="py-2 px-2 font-medium">{order.orderId}</td>
                    <td className="py-2 px-2">{order.product}</td>
                    <td className="py-2 px-2">{order.buyer}</td>
                    <td className="py-2 px-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2 px-2">${order.total}</td>
                    <td className="py-2 px-2 flex flex-wrap items-center gap-2">
                      {order.status === "Pending" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(order.id, "Shipped")
                          }
                          className="flex items-center gap-1 text-blue-500 hover:text-blue-700 transition text-sm"
                        >
                          <FaShippingFast /> Ship
                        </button>
                      )}
                      {order.status === "Shipped" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(order.id, "Delivered")
                          }
                          className="flex items-center gap-1 text-green-600 hover:text-green-800 transition text-sm"
                        >
                          <FaCheckCircle /> Deliver
                        </button>
                      )}
                      {order.status === "Delivered" && (
                        <span className="text-gray-400 flex items-center gap-1 text-sm">
                          <FaClock /> Completed
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
