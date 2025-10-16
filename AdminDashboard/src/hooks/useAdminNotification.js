import { useState } from "react";
import {
  sendNotification as sendNotificationAPI,
  getNotificationHistory,
  deleteNotification,
  getNotificationById,
} from "../services/notificationApi.js";

export function useAdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Send a new notification
  const sendNotification = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await sendNotificationAPI(data);
      return res;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send notification");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Get notification history with filters
  const fetchHistory = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Send filters as query params
      const params = new URLSearchParams();
      if (filters.channel) params.append("channel", filters.channel);
      if (filters.status) params.append("status", filters.status);
      if (filters.dateRange) params.append("dateRange", filters.dateRange);

      const notifications = await getNotificationHistory(params.toString());
      setNotifications(notifications);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Get single notification by ID
  const fetchNotificationById = async (id) => {
    try {
      setLoading(true);
      const notification = await getNotificationById(id);
      return notification;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notification");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete notification
  const removeNotification = async (id) => {
    try {
      setLoading(true);
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete notification");
    } finally {
      setLoading(false);
    }
  };

  return {
    notifications,
    sendNotification,
    fetchHistory,
    fetchNotificationById,
    removeNotification,
    loading,
    error,
  };
}
