import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaShippingFast, FaCheckCircle, FaClock } from "react-icons/fa";
import {
  getSellerOrders,
  markAsShipped,
  updateSellerOrderStatus,
} from "../../service/orderService";
import toast from "react-hot-toast";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [trackingData, setTrackingData] = useState({
    courier: "",
    trackingNumber: "",
  });
  const [updating, setUpdating] = useState(false);
  console.log(orders);
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getSellerOrders(); // backend returns flattened array with address
        setOrders(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch seller orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle status updates (completed)
  const handleStatusUpdate = async (id, newStatus) => {
    setUpdating(true);
    try {
      await updateSellerOrderStatus(id, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
      toast.success(`Status updated to "${newStatus}"`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  // Open shipping modal
  const handleShip = (order) => {
    setCurrentOrder(order);
    setTrackingData({ courier: "", trackingNumber: "" });
    setModalOpen(true);
  };

  // Submit shipping
  const submitShip = async () => {
    if (!currentOrder) return;
    setUpdating(true);
    try {
      await markAsShipped(currentOrder.orderId, currentOrder.productId);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === currentOrder._id ? { ...o, status: "shipped" } : o
        )
      );
      toast.success("Order marked as shipped!");
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark as shipped.");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "funds_held":
      case "payment_submitted":
        return "text-yellow-600 bg-yellow-50";
      case "shipped":
        return "text-blue-600 bg-blue-50";
      case "completed":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Seller Orders</h2>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 overflow-x-auto"
        >
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="text-gray-500 text-sm border-b border-gray-200">
                <th className="py-2 px-2">Order ID</th>
                <th className="py-2 px-2">Product</th>
                <th className="py-2 px-2">Buyer</th>
                <th className="py-2 px-2">Email</th>
                <th className="py-2 px-2">Address</th>
                <th className="py-2 px-2">Phone</th>
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
                  {/* ✅ new address and phone columns */}
                  <td className="py-2 px-2">{order.address}</td>
                  <td className="py-2 px-2">{order.phone}</td>
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
                    {order.status === "funds_held" && (
                      <button
                        onClick={() => handleShip(order)}
                        className="flex items-center gap-1 text-blue-500 hover:text-blue-700 transition text-sm"
                      >
                        <FaShippingFast /> Ship
                      </button>
                    )}
                    {order.status === "shipped" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(order._id, "completed")
                        }
                        className="flex items-center gap-1 text-green-600 hover:text-green-800 transition text-sm"
                      >
                        <FaCheckCircle /> Complete
                      </button>
                    )}
                    {order.status === "completed" && (
                      <span className="text-gray-400 flex items-center gap-1 text-sm">
                        <FaClock /> Done
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Modal for Shipping */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Ship Product</h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Courier (optional)"
                value={trackingData.courier}
                onChange={(e) =>
                  setTrackingData({ ...trackingData, courier: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
              <input
                type="text"
                placeholder="Tracking Number (optional)"
                value={trackingData.trackingNumber}
                onChange={(e) =>
                  setTrackingData({
                    ...trackingData,
                    trackingNumber: e.target.value,
                  })
                }
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={submitShip}
                disabled={updating}
                className={`px-4 py-2 rounded text-white ${
                  updating ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {updating ? "Processing..." : "Ship"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
