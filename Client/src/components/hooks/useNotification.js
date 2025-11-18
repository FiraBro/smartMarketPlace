// src/hooks/useNotifications.js
import { useState, useEffect, useCallback } from "react";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification as deleteNotificationApi,
} from "../../service/adminNotificationService";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ---------------------------
  // Load notifications
  // ---------------------------
  const loadNotifications = useCallback(async (currentPage = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNotifications(currentPage);
      setNotifications(data.notifications);
      setUnreadCount(data.notifications.filter((n) => !n.read).length);
      setPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // ---------------------------
  // Mark notification as read
  // ---------------------------
  const markNotificationAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    }
  };

  // ---------------------------
  // Mark all notifications as read
  // ---------------------------
  const markAllNotificationsAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    }
  };

  // ---------------------------
  // Delete a notification
  // ---------------------------
  const deleteNotification = async (id) => {
    try {
      await deleteNotificationApi(id);
      const notificationToDelete = notifications.find((n) => n._id === id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (notificationToDelete && !notificationToDelete.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete notification");
    }
  };

  return {
    notifications,
    loading,
    error,
    unreadCount,
    page,
    totalPages,
    loadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  };
};
