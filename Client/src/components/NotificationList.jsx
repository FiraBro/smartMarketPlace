// src/components/NotificationList.jsx
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaSync } from "react-icons/fa";
import {
  fetchNotifications,
  markAsRead as markAsReadAPI,
  markAllAsRead as markAllAsReadAPI,
} from "../service/notificationService";

export default function NotificationList({ userType }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, hasMore: false });

  // ----------------- Load notifications -----------------
  const loadNotifications = useCallback(
    async (page = 1, append = false) => {
      try {
        page === 1 ? setLoading(true) : setLoadingMore(true);
        setError(null);
        const res = await fetchNotifications(page, 10);

        if (append) {
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n._id));
            const newNotifications = res.notifications.filter((n) => !existingIds.has(n._id));
            return [...prev, ...newNotifications];
          });
        } else {
          setNotifications(res.notifications);
        }

        setPagination({
          currentPage: res.pagination.currentPage,
          hasMore: res.pagination.hasMore,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    loadNotifications(1, false);
  }, [loadNotifications]);

  // ----------------- Mark all as read -----------------
  const markAllAsRead = useCallback(async () => {
    const original = [...notifications];
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await markAllAsReadAPI();
    } catch (err) {
      console.error(err);
      setNotifications(original);
    }
  }, [notifications]);

  // ----------------- Mark single as read -----------------
  const toggleRead = useCallback(
    async (id) => {
      const original = [...notifications];
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
      try {
        await markAsReadAPI(id);
      } catch (err) {
        console.error(err);
        setNotifications(original);
      }
    },
    [notifications]
  );

  // ----------------- Load more -----------------
  const loadMore = async () => {
    if (!pagination.hasMore || loadingMore) return;
    await loadNotifications(pagination.currentPage + 1, true);
  };

  if (loading) return <FaSpinner className="animate-spin text-3xl" />;

  if (!notifications.length)
    return (
      <div className="text-gray-500 text-center mt-10">
        <FaBell className="text-5xl mb-4 mx-auto" />
        No notifications
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{userType} Notifications</h2>
        <button onClick={markAllAsRead} className="bg-[#faa64d] text-white px-3 py-1 rounded">
          Mark All Read
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {notifications.map((notif) => (
            <motion.div
              key={notif._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              onClick={() => toggleRead(notif._id)}
              className={`p-4 rounded-lg border cursor-pointer ${
                notif.read ? "bg-white border-gray-200" : "bg-[#fff9f3] border-[#faa64d]/30"
              }`}
            >
              <h3 className={`font-semibold ${notif.read ? "opacity-70" : ""}`}>{notif.title}</h3>
              <p className={`text-sm text-gray-600 ${notif.read ? "opacity-60" : ""}`}>{notif.message}</p>
              <span className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleString()}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {pagination.hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMore}
            className="px-6 py-2 border rounded text-gray-600 hover:bg-gray-50"
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
