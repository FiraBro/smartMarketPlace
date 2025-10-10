import { useState } from "react";
import { motion } from "framer-motion";
import { FaBell, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function SellerNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Order Received",
      message: "You received a new order for Nike Air Max.",
      type: "order",
      time: "5 mins ago",
      read: false,
    },
    {
      id: 2,
      title: "Product Approved",
      message: "Your product 'Adidas UltraBoost' has been approved.",
      type: "product",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Payment Processed",
      message: "Payment for Order #4521 has been completed successfully.",
      type: "payment",
      time: "Yesterday",
      read: true,
    },
  ]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <FaBell className="text-[#faa64d] text-2xl" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Notifications
            </h2>
          </div>
          <button
            onClick={markAllAsRead}
            className="text-sm px-4 py-2 bg-[#faa64d] text-white rounded-lg hover:bg-[#e2953f] transition-all"
          >
            Mark all as read
          </button>
        </div>

        {/* Notification List */}
        <div className="flex flex-col gap-3">
          {notifications.map((notif, index) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => toggleRead(notif.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                notif.read
                  ? "bg-white border-gray-100"
                  : "bg-[#fff9f3] border-[#faa64d]/20"
              } hover:shadow-sm`}
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <h3
                    className={`font-semibold text-gray-800 ${
                      notif.read ? "opacity-70" : ""
                    }`}
                  >
                    {notif.title}
                  </h3>
                  <p
                    className={`text-sm text-gray-600 ${
                      notif.read ? "opacity-60" : ""
                    }`}
                  >
                    {notif.message}
                  </p>
                  <span className="text-xs text-gray-400 mt-1">
                    {notif.time}
                  </span>
                </div>
                <div>
                  {notif.read ? (
                    <FaCheckCircle className="text-green-500 text-lg" />
                  ) : (
                    <FaTimesCircle className="text-red-400 text-lg" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <FaBell className="text-5xl text-gray-300 mb-2" />
            <p>No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
