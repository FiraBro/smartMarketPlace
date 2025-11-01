// src/components/notification/NotificationList.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { fetchNotifications, markAsRead, markAllAsRead } from "../service/notificationService";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  X, 
  Check, 
  CheckCircle, 
  Circle, 
  Clock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const NotificationList = ({ userType }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const dropdownRef = useRef(null);

  const loadNotifications = useCallback(async (currentPage = 1) => {
    try {
      setLoading(true);
      const data = await fetchNotifications(currentPage);
      setNotifications(data.notifications);
      setPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true });
    socket.emit("joinNotifications", { userType });

    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => socket.disconnect();
  }, [userType]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon with Modern Design */}
      <button
        className="relative p-3 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
        onClick={() => setDropdownOpen((prev) => !prev)}
      >
        <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-80 bg-white shadow-2xl rounded-2xl overflow-hidden z-50 flex flex-col border border-gray-100"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-blue-600 font-medium mt-1">
                    {unreadCount} unread {unreadCount === 1 ? 'message' : 'messages'}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    Mark all
                  </button>
                )}
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto flex-1 max-h-96">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No notifications</p>
                  <p className="text-gray-400 text-sm mt-1">We'll notify you when something arrives</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {notifications.map((n) => (
                      <motion.li
                        key={n._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer group ${
                          n.read ? 'bg-white' : 'bg-blue-50/50 border-l-4 border-l-blue-500'
                        }`}
                        onClick={() => !n.read && handleMarkAsRead(n._id)}
                      >
                        <div className="flex gap-3">
                          {/* Status Icon */}
                          <div className="flex-shrink-0 mt-0.5">
                            {n.read ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <div className="relative">
                                <Circle className="w-4 h-4 text-blue-500 fill-blue-500" />
                                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                              </div>
                            )}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${
                              n.read ? 'text-gray-700' : 'text-gray-900'
                            }`}>
                              {n.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {getTimeAgo(n.createdAt)}
                              </span>
                            </div>
                          </div>

                          {/* Action Button */}
                          {!n.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(n._id);
                              }}
                              className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-3 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => loadNotifications(page - 1)}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>
                <span className="text-sm font-medium text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => loadNotifications(page + 1)}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationList;