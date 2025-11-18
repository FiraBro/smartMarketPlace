// src/hooks/useAdminNotifications.js
import { useState, useCallback } from "react";
import {
  sendNotification as sendNotificationAPI,
  getNotificationHistory,
  deleteNotification,
  getNotificationById,
} from "../../service/adminNotificationService";

export function useAdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendNotification = async (data) => {
    try {
      setLoading(true);
      setError(null);
      await sendNotificationAPI(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send notification");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.channel && filters.channel !== "all")
        params.append("channel", filters.channel);
      if (filters.status && filters.status !== "all")
        params.append("status", filters.status);
      if (filters.dateRange) params.append("dateRange", filters.dateRange);

      const data = await getNotificationHistory(params.toString());
      setNotifications(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNotificationById = async (id) => {
    try {
      setLoading(true);
      return await getNotificationById(id);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notification");
    } finally {
      setLoading(false);
    }
  };

  const removeNotification = async (id) => {
    try {
      setLoading(true);
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
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
