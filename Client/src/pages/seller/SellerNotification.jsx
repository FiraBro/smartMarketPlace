import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBell, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import io from "socket.io-client";
import {
  fetchNotifications,
  markAllAsRead as markAllAsReadAPI,
  markAsRead as markAsReadAPI,
} from "../../service/notificationService";

// Replace with your backend URL
const SOCKET_URL = import.meta.env.VITE_API_URL;

export default function SellerNotifications({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  // ---------------------------
  // Fetch initial notifications
  // ---------------------------
  useEffect(() => {
    const loadNotifications = async () => {
      const data = await fetchNotifications();
      setNotifications(
        data.map((n) => ({
          ...n,
          read: n.readBy.includes(userId),
        }))
      );
    };
    loadNotifications();
  }, [userId]);

  // ---------------------------
  // Setup real-time socket connection
  // ---------------------------
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
    });
    setSocket(newSocket);

    // Join user's notification room
    newSocket.emit("joinRoom", `notifications:${userId}`);

    // Listen for new notifications
    newSocket.on("notification", (notif) => {
      setNotifications((prev) => [
        { ...notif, read: notif.readBy.includes(userId) },
        ...prev,
      ]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  // ---------------------------
  // Mark all as read
  // ---------------------------
  const markAllAsRead = async () => {
    await markAllAsReadAPI();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // ---------------------------
  // Toggle single notification read
  // ---------------------------
  const toggleRead = async (id) => {
    const notif = notifications.find((n) => n._id === id);
    if (!notif.read) {
      await markAsReadAPI(id);
    }
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
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
              key={notif._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => toggleRead(notif._id)}
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
                    {new Date(notif.createdAt).toLocaleString()}
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
