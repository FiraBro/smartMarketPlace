import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import { fetchNotifications } from '../service/notificationService';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { socket, isConnected } = useSocket();

  // 🔹 Fetch unread count (fallback)
  const fetchUnreadCount = async () => {
    if (!user?._id && !user?.id) return;
    try {
      setLoading(true);
      const data = await fetchNotifications(1, 100);
      const totalUnread = data.notifications?.filter(n => !n.read).length || 0;
      setUnreadCount(data.unreadCount || totalUnread || 0);
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error('❌ Error fetching unread count:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Increment unread count when new notifications arrive via socket
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      console.log('📨 New real-time notification:', notification);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1); // 🔥 increment immediately
    };

    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, [socket]);

  // 🔹 Listen for mark-as-read events to decrement
  useEffect(() => {
    if (!socket) return;

    const handleMarkAsRead = (data) => {
      console.log('✅ Notification marked as read via socket:', data);
      setNotifications(prev =>
        prev.map(n =>
          n._id === data.notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    };

    socket.on('notification_read', handleMarkAsRead);

    return () => {
      socket.off('notification_read', handleMarkAsRead);
    };
  }, [socket]);

  // 🔹 Fetch initial unread count on mount
  useEffect(() => {
    if (user?.id || user?._id) {
      fetchUnreadCount();
    } else {
      setUnreadCount(0);
    }
  }, [user?.id, user?._id]);

  const value = {
    unreadCount,
    notifications,
    setNotifications,
    refreshCount: fetchUnreadCount,
    markAllAsRead: () => setUnreadCount(0),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
