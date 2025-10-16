import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaBox, FaTruck, FaCheckCircle, FaPercent } from "react-icons/fa";
import {
  fetchNotifications,
  markAllAsRead,
  markAsRead,
} from "../service/notificationService";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";

export default function NotificationsTab() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  // -----------------------------
  // Fetch notifications & setup Socket.IO
  // -----------------------------
  useEffect(() => {
    if (!user) return;

    // 1️⃣ Fetch existing notifications
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    loadNotifications();

    // 2️⃣ Connect to Socket.IO
    const newSocket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
    });

    // Join user-specific room
    newSocket.emit("join", `notifications:${user._id}`);

    // Listen for real-time notifications
    newSocket.on("notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => newSocket.disconnect();
  }, [user]);

  // -----------------------------
  // Mark all notifications as read
  // -----------------------------
  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  };

  // -----------------------------
  // Mark single notification as read
  // -----------------------------
  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  // -----------------------------
  // Render notifications
  // -----------------------------
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
            onClick={handleMarkAllRead}
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
              key={notif._id || index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => !notif.read && handleMarkRead(notif._id)}
              className={`flex items-start gap-4 border border-gray-100 p-4 rounded-xl hover:shadow-md transition cursor-pointer ${
                notif.read ? "bg-gray-50" : "bg-[#fff9f2]"
              }`}
            >
              <div className="text-2xl">
                {{
                  order: <FaBox className="text-[#f9A03f]" />,
                  delivery: <FaTruck className="text-[#4CAF50]" />,
                  promo: <FaPercent className="text-[#2196F3]" />,
                  success: <FaCheckCircle className="text-[#4CAF50]" />,
                }[notif.type] || <FaBox />}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{notif.title}</h3>
                <p className="text-sm text-gray-600">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
              {!notif.read && (
                <div className="w-3 h-3 bg-[#f9A03f] rounded-full mt-1"></div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-gray-500 mt-4">No notifications yet</p>
        </div>
      )}
    </motion.div>
  );
}
