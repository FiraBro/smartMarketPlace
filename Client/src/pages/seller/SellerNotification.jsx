import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaExclamationTriangle, FaSpinner, FaSync } from "react-icons/fa";
import io from "socket.io-client";
import { useAuth } from "../../context/AuthContext";
import { fetchNotifications } from "../../service/notificationService";

const SOCKET_SERVER = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SellerNotifications() {
  const { user, loading: authLoading } = useAuth();
  const userId = user?._id;

  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalNotifications: 0,
    hasMore: false,
  });

  // =============================
  // Ask for browser notification permission
  // =============================
  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window && Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch (err) {
        console.warn("Notification permission request failed:", err);
      }
    }
  }, []);

  // =============================
  // Show browser notification
  // =============================
  const showBrowserNotification = useCallback((notif) => {
    if (Notification.permission === "granted" && !notif.read) {
      try {
        new Notification(notif.title, {
          body: notif.message.length > 100 ? notif.message.substring(0, 100) + "..." : notif.message,
          icon: "/favicon.ico",
          tag: notif._id,
          requireInteraction: true,
        });
      } catch (err) {
        console.warn("Browser notification failed:", err);
      }
    }
  }, []);

  // =============================
  // Fetch notifications
  // =============================
  const loadNotifications = useCallback(
    async (pageNum = 1, append = false) => {
      if (!userId) return;

      pageNum === 1 ? setLoading(true) : setLoadingMore(true);
      setError(null);

      try {
        const response = await fetchNotifications(pageNum, 10);
        const notificationsData = response.notifications || [];
        const paginationData = response.pagination || {
          currentPage: pageNum,
          totalPages: 1,
          totalNotifications: notificationsData.length,
          hasMore: false,
        };

        setNotifications((prev) => {
          if (append) {
            const existingIds = new Set(prev.map((n) => n._id));
            const newOnes = notificationsData.filter((n) => !existingIds.has(n._id));
            return [...prev, ...newOnes];
          } else {
            return notificationsData;
          }
        });

        setPagination(paginationData);
      } catch (err) {
        console.error("Failed to load notifications:", err);
        setError("Failed to load notifications. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    if (userId) {
      loadNotifications(1, false);
      requestNotificationPermission();
    }
  }, [userId, loadNotifications, requestNotificationPermission]);

  // =============================
  // Socket connection
  // =============================
  useEffect(() => {
    if (!userId) return;

    const socketInstance = io(SOCKET_SERVER, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketInstance.on("connect", () => {
      socketInstance.emit("joinRoom", `notifications:${userId}`);
    });

    socketInstance.on("notification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      showBrowserNotification(notif);
    });

    socketInstance.on("disconnect", (reason) => console.log("Socket disconnected:", reason));
    socketInstance.on("connect_error", (err) => console.error("Socket connection error:", err));

    setSocket(socketInstance);
    return () => socketInstance.disconnect();
  }, [userId, showBrowserNotification]);

  // =============================
  // Load more
  // =============================
  const loadMore = useCallback(async () => {
    if (loadingMore || !pagination.hasMore) return;
    await loadNotifications(pagination.currentPage + 1, true);
  }, [loadingMore, pagination, loadNotifications]);

  // =============================
  // Refresh
  // =============================
  const refreshNotifications = useCallback(() => loadNotifications(1, false), [loadNotifications]);

  // =============================
  // Filtered notifications
  // =============================
  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.read;
    if (filter === "read") return notif.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  // =============================
  // Auto clear error
  // =============================
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // =============================
  // UI Rendering
  // =============================
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <FaSpinner className="text-4xl animate-spin mb-4" />
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <FaExclamationTriangle className="text-5xl text-yellow-400 mb-4" />
        <p className="text-lg font-medium mb-2">Please log in to view notifications</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <FaBell className="text-[#faa64d] text-2xl" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
            <button onClick={refreshNotifications} disabled={loading} className="ml-2 p-2 text-gray-500 hover:text-gray-700">
              <FaSync className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {["all", "unread", "read"].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1 text-sm rounded-md capitalize ${
                    filter === filterType ? "bg-white text-[#faa64d] shadow-sm font-medium" : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {filterType}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {!loading && filteredNotifications.length > 0 && (
          <div className="flex flex-col gap-3 mb-6">
            <AnimatePresence mode="popLayout">
              {filteredNotifications.map((notif, index) => (
                <motion.div
                  key={notif._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`p-4 rounded-xl border ${
                    notif.read ? "bg-white border-gray-200" : "bg-[#fff9f3] border-[#faa64d]/30 shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-gray-800 ${notif.read ? "opacity-70" : ""}`}>{notif.title}</h3>
                      <p className={`text-sm text-gray-600 mt-1 ${notif.read ? "opacity-60" : ""}`}>{notif.message}</p>
                      <span className="text-xs text-gray-400 mt-2 block">{new Date(notif.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex-shrink-0">
                      {!notif.read && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" title="Unread" />
                          <span className="text-xs text-red-500 font-medium">New</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredNotifications.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <FaBell className="text-5xl text-gray-300 mb-4" />
            <p className="text-lg font-medium mb-2">No notifications</p>
          </div>
        )}

        {/* Load More */}
        {pagination.hasMore && (
          <div className="flex justify-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              {loadingMore ? <FaSpinner className="animate-spin" /> : "Load More Notifications"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}