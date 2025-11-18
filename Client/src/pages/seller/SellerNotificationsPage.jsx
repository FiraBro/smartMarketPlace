import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast"; // ✅ Import react-hot-toast
import { useSocket } from "../../context/SocketContext";
import { useNotification } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
} from "../../service/notificationService";
import NotificationCard from "../../components/NotificationCard";
import NotificationSkeleton from "../../components/NotificationSkeleton";
import NotificationHeader from "../../components/NotificationHeader";
import EmptyState from "../../components/EmptyState";
import ConnectionStatus from "../../components/ConnectionStatus";
import NotificationTabs from "../../components/NotificationTab";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const { user } = useAuth();
  const {
    socket,
    isConnected,
    notifications: realTimeNotifications,
  } = useSocket();
  const {
    updateUnreadCount,
    decrementUnreadCount,
    markAllAsRead: markAllAsReadGlobal,
  } = useNotification();

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    return notification.type === activeTab;
  });

  const notificationCounts = {
    all: notifications.length,
    info: notifications.filter((n) => n.type === "info").length,
    alert: notifications.filter((n) => n.type === "alert").length,
    reminder: notifications.filter((n) => n.type === "reminder").length,
    order: notifications.filter((n) => n.type === "order").length,
    payment: notifications.filter((n) => n.type === "payment").length,
  };

  const unreadCounts = {
    all: notifications.filter((n) => !n.read).length,
    info: notifications.filter((n) => n.type === "info" && !n.read).length,
    alert: notifications.filter((n) => n.type === "alert" && !n.read).length,
    reminder: notifications.filter((n) => n.type === "reminder" && !n.read)
      .length,
    order: notifications.filter((n) => n.type === "order" && !n.read).length,
    payment: notifications.filter((n) => n.type === "payment" && !n.read)
      .length,
  };

  // Combine API notifications with real-time notifications
  useEffect(() => {
    if (realTimeNotifications.length > 0) {
      setNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n._id));
        const newNotifications = realTimeNotifications.filter(
          (n) => !existingIds.has(n._id)
        );
        return [...newNotifications, ...prev];
      });
      toast("New notification received!"); // ✅ Toast for new real-time notifications
    }
  }, [realTimeNotifications]);

  // Fetch notifications
  const loadNotifications = useCallback(
    async (pageNum = 1, shouldAppend = false) => {
      try {
        setLoading(true);
        const data = await fetchNotifications(pageNum, 15);

        if (shouldAppend) {
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n._id));
            const newNotifications = data.notifications.filter(
              (n) => !existingIds.has(n._id)
            );
            return [...prev, ...newNotifications];
          });
        } else {
          setNotifications(data.notifications);
        }

        updateUnreadCount(data.unreadCount || 0);
        setHasMore(data.notifications.length === 15);
      } catch (error) {
        console.error("Error loading notifications:", error);
        toast.error("Failed to load notifications"); // ✅ Toast on error
      } finally {
        setLoading(false);
      }
    },
    [updateUnreadCount]
  );

  // Mark single notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );

      decrementUnreadCount();
      toast.success("Marked as read!"); // ✅ Toast success

      if (socket && isConnected) {
        socket.emit("mark_as_read", { notificationId: id });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark notification as read"); // ✅ Toast failure
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const notificationsToMark =
        activeTab === "all"
          ? notifications.filter((n) => !n.read)
          : notifications.filter((n) => n.type === activeTab && !n.read);

      if (notificationsToMark.length === 0)
        return toast("No unread notifications");

      await Promise.all(notificationsToMark.map((n) => markAsRead(n._id)));

      setNotifications((prev) =>
        prev.map((n) =>
          notificationsToMark.find((x) => x._id === n._id)
            ? { ...n, read: true }
            : n
        )
      );

      notificationsToMark.forEach(() => decrementUnreadCount());
      toast.success("All notifications marked as read"); // ✅ Toast success

      if (socket && isConnected) socket.emit("mark_all_read");
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark all notifications as read"); // ✅ Toast failure
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Load more notifications
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadNotifications(nextPage, true);
  };

  // Refresh notifications
  const refreshNotifications = () => {
    setPage(1);
    loadNotifications(1, false);
  };

  // Test real-time notification
  const testRealTimeNotification = (type = "info") => {
    if (socket && isConnected) {
      const testMessages = {
        info: {
          title: "System Update",
          message: "Your seller dashboard has been updated with new features.",
          type: "info",
        },
        alert: {
          title: "Low Stock Alert",
          message: 'Product "Wireless Earbuds" is running low on stock.',
          type: "alert",
        },
        reminder: {
          title: "Payment Reminder",
          message: "Don't forget to process pending orders from yesterday.",
          type: "reminder",
        },
        order: {
          title: "New Order Received",
          message: "You have a new order #ORD-1234 for $99.99",
          type: "order",
        },
        payment: {
          title: "Payment Received",
          message: "Payment of $249.99 has been processed successfully.",
          type: "payment",
        },
      };

      socket.emit("test_notification", testMessages[type]);
      toast.success("Test notification sent!"); // ✅ Toast for test
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ConnectionStatus isConnected={isConnected} />

        <NotificationHeader
          unreadCount={unreadCounts.all}
          onMarkAllAsRead={handleMarkAllAsRead}
          onRefresh={refreshNotifications}
          onTestNotification={testRealTimeNotification}
          loading={loading}
          isConnected={isConnected}
          activeTab={activeTab}
        />

        <NotificationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={notificationCounts}
          unreadCounts={unreadCounts}
          role={user.role}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl shadow-sm border-none overflow-hidden mt-4"
        >
          {loading && notifications.length === 0 ? (
            <div className="divide-y divide-gray-100">
              {[...Array(5)].map((_, index) => (
                <NotificationSkeleton key={index} />
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <EmptyState type={activeTab} />
          ) : (
            <AnimatePresence>
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification, index) => (
                  <NotificationCard
                    key={notification._id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    index={index}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}

          {hasMore &&
            !loading &&
            filteredNotifications.length > 0 &&
            activeTab === "all" && (
              <div className="p-6 text-center border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={loadMore}
                  className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg font-medium hover:from-orange-500 hover:to-orange-600 transition-all cursor-pointer duration-200 shadow-sm"
                >
                  Load More
                </motion.button>
              </div>
            )}

          {loading && filteredNotifications.length > 0 && (
            <div className="p-6 text-center">
              <div className="flex justify-center items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationPage;
