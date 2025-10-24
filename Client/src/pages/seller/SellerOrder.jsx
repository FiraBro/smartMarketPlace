// src/pages/seller/SellerOrders.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaShippingFast, FaCheckCircle, FaClock } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  getSellerOrders,
  updateOrderStatus,
} from "../../service/sellerService";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch seller orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getSellerOrders();

        // Flatten orders for table display
        const flatOrders = data.orders
          .map((order) => {
            return order.products.map((p) => ({
              _id: p._id,
              orderId: order._id,
              product: p.product?.title || "Product",
              buyerName: order.user?.name || "Unknown",
              buyerEmail: order.user?.email || "N/A",
              status: p.status,
              total: (p.product?.price || 0) * p.quantity,
            }));
          })
          .flat();

        setOrders(flatOrders);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

 const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "text-yellow-600 bg-yellow-50";
    case "shipped":
      return "text-blue-600 bg-blue-50";
    case "delivered":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-500 bg-gray-50";
  }
};


  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 sm:p-6 md:p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Orders</h2>

        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="text-gray-500 text-sm border-b border-gray-200">
                    <th className="py-2 px-2">Order ID</th>
                    <th className="py-2 px-2">Product</th>
                    <th className="py-2 px-2">Buyer</th>
                    <th className="py-2 px-2">Email</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-2">Total</th>
                    <th className="py-2 px-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 text-sm"
                    >
                      <td className="py-2 px-2 font-medium">{order.orderId}</td>
                      <td className="py-2 px-2">{order.product}</td>
                      <td className="py-2 px-2">{order.buyerName}</td>
                      <td className="py-2 px-2">{order.buyerEmail}</td>
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
                        {order.status.toLowerCase() === "pending" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order._id, "shipped")
                            }
                            className="flex items-center gap-1 text-blue-500 hover:text-blue-700 transition text-sm"
                          >
                            <FaShippingFast /> Ship
                          </button>
                        )}
                        {order.status.toLowerCase() === "shipped" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order._id, "delivered")
                            }
                            className="flex items-center gap-1 text-green-600 hover:text-green-800 transition text-sm"
                          >
                            <FaCheckCircle /> Deliver
                          </button>
                        )}
                        {order.status.toLowerCase() === "delivered" && (
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
        )}
      </div>
    </div>
  );
}
