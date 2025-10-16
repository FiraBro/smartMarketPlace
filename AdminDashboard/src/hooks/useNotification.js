// src/hooks/useNotifications.js
import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '../services/notificationApi';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationApi.getUserNotifications(params);
      setNotifications(response.data.data);
      setUnreadCount(response.data.unreadCount);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === id 
            ? { ...notification, read: true, readAt: new Date() }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => 
        prev.map(notification => ({ 
          ...notification, 
          read: true, 
          readAt: new Date() 
        }))
      );
      setUnreadCount(0);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to mark all as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationApi.deleteNotification(id);
      const notificationToDelete = notifications.find(n => n._id === id);
      setNotifications(prev => prev.filter(notification => notification._id !== id));
      if (notificationToDelete && !notificationToDelete.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete notification');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications,
  };
};