import { useState } from "react";
import {
  sendNotification as sendNotificationAPI,
  getNotificationHistory,
  deleteNotification,
  getNotificationById,
} from "../services/notificationApi.js";

export function useAdminNotifications() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Send a new notification
  const sendNotification = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await sendNotificationAPI(data);
      return res; // You can return { message, notification, etc. } from backend
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send notification");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Get notification history (for admin)
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const notifications = await getNotificationHistory();
      return notifications;
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
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete notification");
    } finally {
      setLoading(false);
    }
  };

  return {
    sendNotification,
    fetchHistory,
    fetchNotificationById,
    removeNotification,
    loading,
    error,
  };
}
