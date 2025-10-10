// src/components/NotificationsTab.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import Lottie from "lottie-react";
// import emptyAnim from "../assets/animations/empty.json";
import { FaBox, FaTruck, FaCheckCircle, FaPercent } from "react-icons/fa";

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "order",
      title: "Order Confirmed",
      message: "Your order #1234 has been confirmed!",
      icon: <FaBox className="text-[#f9A03f]" />,
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "delivery",
      title: "Out for Delivery",
      message: "Your order #1234 is on its way 🚚",
      icon: <FaTruck className="text-[#4CAF50]" />,
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      type: "promo",
      title: "Limited Offer",
      message: "Get 15% off your next order — valid today only!",
      icon: <FaPercent className="text-[#2196F3]" />,
      time: "Yesterday",
      read: true,
    },
    {
      id: 4,
      type: "delivery",
      title: "Delivered Successfully",
      message: "Order #1234 has been delivered. Enjoy your purchase!",
      icon: <FaCheckCircle className="text-[#4CAF50]" />,
      time: "2 days ago",
      read: true,
    },
  ]);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-md p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm bg-[#f9A03f] text-white px-4 py-1.5 rounded-lg hover:bg-[#faa64d] transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notif, index) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-start gap-4 border border-gray-100 p-4 rounded-xl hover:shadow-md transition cursor-pointer ${
                notif.read ? "bg-gray-50" : "bg-[#fff9f2]"
              }`}
            >
              <div className="text-2xl">{notif.icon}</div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{notif.title}</h3>
                <p className="text-sm text-gray-600">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
              </div>
              {!notif.read && (
                <div className="w-3 h-3 bg-[#f9A03f] rounded-full mt-1"></div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          {/* <Lottie animationData={emptyAnim} className="w-48 h-48" /> */}
          <p className="text-gray-500 mt-4">No notifications yet</p>
        </div>
      )}
    </motion.div>
  );
}
