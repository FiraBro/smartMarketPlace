import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSocket } from '../../context/SocketContext';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { 
  fetchNotifications, 
  markAsRead, 
  markAllAsRead 
} from '../../service/notificationService';
import NotificationCard from '../../components/NotificationCard';
import NotificationSkeleton from '../../components/NotificationSkeleton';
import NotificationHeader from '../../components/NotificationHeader';
import EmptyState from '../../components/EmptyState';
import ConnectionStatus from '../../components/ConnectionStatus';
import NotificationTabs from '../../components/NotificationTab';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const {user} = useAuth()
  
  const { socket, isConnected, notifications: realTimeNotifications } = useSocket();
  const { updateUnreadCount, decrementUnreadCount, markAllAsRead: markAllAsReadGlobal } = useNotification();

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    switch (activeTab) {
      case 'all':
        return true;
      case 'info':
        return notification.type === 'info';
      case 'alert':
        return notification.type === 'alert';
      case 'reminder':
        return notification.type === 'reminder';
      case 'order':
        return notification.type === 'order';
      case 'payment':
        return notification.type === 'payment';
      default:
        return true;
    }
  });

  // Count notifications by type
  const notificationCounts = {
    all: notifications.length,
    info: notifications.filter(n => n.type === 'info').length,
    alert: notifications.filter(n => n.type === 'alert').length,
    reminder: notifications.filter(n => n.type === 'reminder').length,
    order: notifications.filter(n => n.type === 'order').length,
    payment: notifications.filter(n => n.type === 'payment').length,
  };

  // Count unread by type
  const unreadCounts = {
    all: notifications.filter(n => !n.read).length,
    info: notifications.filter(n => n.type === 'info' && !n.read).length,
    alert: notifications.filter(n => n.type === 'alert' && !n.read).length,
    reminder: notifications.filter(n => n.type === 'reminder' && !n.read).length,
    order: notifications.filter(n => n.type === 'order' && !n.read).length,
    payment: notifications.filter(n => n.type === 'payment' && !n.read).length,
  };

  // Combine API notifications with real-time notifications
  useEffect(() => {
    if (realTimeNotifications.length > 0) {
      setNotifications(prev => {
        const existingIds = new Set(prev.map(n => n._id));
        const newNotifications = realTimeNotifications.filter(
          n => !existingIds.has(n._id)
        );
        return [...newNotifications, ...prev];
      });
    }
  }, [realTimeNotifications]);

  // Fetch notifications with useCallback to prevent infinite re-renders
  const loadNotifications = useCallback(async (pageNum = 1, shouldAppend = false) => {
    try {
      setLoading(true);
      const data = await fetchNotifications(pageNum, 15);
      
      if (shouldAppend) {
        setNotifications(prev => {
          const existingIds = new Set(prev.map(n => n._id));
          const newNotifications = data.notifications.filter(
            n => !existingIds.has(n._id)
          );
          return [...prev, ...newNotifications];
        });
      } else {
        setNotifications(data.notifications);
      }
      
      // Update global unread count
      updateUnreadCount(data.unreadCount || 0);
      setHasMore(data.notifications.length === 15);
    } catch (error) {
      toast.error('Failed to load notifications');
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [updateUnreadCount]);

  // Mark single notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      
      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification._id === id 
            ? { ...notification, read: true }
            : notification
        )
      );
      
      // Update global unread count
      decrementUnreadCount();
      
      // Emit socket event
      if (socket && isConnected) {
        socket.emit('mark_as_read', { notificationId: id });
      }
      
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  // Mark all as read for current tab
  const handleMarkAllAsRead = async () => {
    try {
      if (activeTab === 'all') {
        // Mark all notifications as read
        await markAllAsRead();
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, read: true }))
        );
        
        // Update global unread count
        markAllAsReadGlobal();
        
        if (socket && isConnected) {
          socket.emit('mark_all_read');
        }
      } else {
        // Mark only notifications of current type as read
        const notificationsToMark = filteredNotifications
          .filter(n => !n.read)
          .map(n => n._id);
        
        if (notificationsToMark.length > 0) {
          await Promise.all(notificationsToMark.map(id => markAsRead(id)));
          
          setNotifications(prev =>
            prev.map(notification =>
              notificationsToMark.includes(notification._id)
                ? { ...notification, read: true }
                : notification
            )
          );
          
          // Update global unread count for each notification marked as read
          for (let i = 0; i < notificationsToMark.length; i++) {
            decrementUnreadCount();
          }
        }
      }
      
      toast.success(`All ${activeTab} notifications marked as read`);
    } catch (error) {
      toast.error('Failed to mark notifications as read');
    }
  };

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

  // Test real-time notification (for demo purposes)
  const testRealTimeNotification = (type = 'info') => {
    if (socket && isConnected) {
      const testMessages = {
        info: {
          title: 'System Update',
          message: 'Your seller dashboard has been updated with new features.',
          type: 'info'
        },
        alert: {
          title: 'Low Stock Alert',
          message: 'Product "Wireless Earbuds" is running low on stock.',
          type: 'alert'
        },
        reminder: {
          title: 'Payment Reminder',
          message: 'Don\'t forget to process pending orders from yesterday.',
          type: 'reminder'
        },
        order: {
          title: 'New Order Received',
          message: 'You have a new order #ORD-1234 for $99.99',
          type: 'order'
        },
        payment: {
          title: 'Payment Received',
          message: 'Payment of $249.99 has been processed successfully.',
          type: 'payment'
        }
      };

      socket.emit('test_notification', testMessages[type]);
      toast.info(`Test ${type} notification sent`);
    } else {
      toast.warning('Socket not connected. Cannot send test notification.');
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Connection Status */}
        <ConnectionStatus isConnected={isConnected} />
        
        {/* Header */}
        <NotificationHeader 
          unreadCount={unreadCounts.all}
          onMarkAllAsRead={handleMarkAllAsRead}
          onRefresh={refreshNotifications}
          onTestNotification={testRealTimeNotification}
          loading={loading}
          isConnected={isConnected}
          activeTab={activeTab}
        />

        {/* Tabs */}
       <NotificationTabs
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  counts={notificationCounts}
  unreadCounts={unreadCounts || {}}
  role={user.role}
/>


        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl shadow-sm border-none overflow-hidden"
        >
          {loading && notifications.length === 0 ? (
            // Loading skeletons
            <div className="divide-y divide-gray-100">
              {[...Array(5)].map((_, index) => (
                <NotificationSkeleton key={index} />
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            // Empty state for current tab
            <EmptyState type={activeTab} />
          ) : (
            // Notifications list
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

          {/* Load More Button - Only show for "all" tab */}
          {hasMore && !loading && filteredNotifications.length > 0 && activeTab === 'all' && (
            <div className="p-6 text-center border-t border-gray-100">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={loadMore}
                className="px-6 py-3 bg-gradient-to-r bg-[#f9A03f] text-white rounded-lg font-medium hover:bg-[#faa64d] transition-all cursor-pointer duration-200 shadow-sm"
              >
                Load More
              </motion.button>
            </div>
          )}

          {/* Loading more indicator */}
          {loading && filteredNotifications.length > 0 && (
            <div className="p-6 text-center">
              <div className="flex justify-center items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationPage;