// src/components/NotificationCard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCheck, 
  FaTimes, 
  FaShoppingBag, 
  FaDollarSign,
  FaExclamationTriangle,
  FaInfoCircle,
  FaBell
} from 'react-icons/fa';

const NotificationCard = ({ notification, onMarkAsRead, index }) => {
  const [isVisible, setIsVisible] = useState(true);

  const getNotificationIcon = (type) => {
    const icons = {
      order: FaShoppingBag,
      payment: FaDollarSign,
      alert: FaExclamationTriangle,
      info: FaInfoCircle
    };
    return icons[type] || FaInfoCircle;
  };

  const getNotificationColor = (type) => {
    const colors = {
      order: 'bg-blue-500',
      payment: 'bg-green-500',
      alert: 'bg-red-500',
      info: 'bg-gray-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const handleMarkAsRead = () => {
    onMarkAsRead(notification._id);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Optional: Add API call to delete notification
  };

  if (!isVisible) return null;

  const IconComponent = getNotificationIcon(notification.type);
  const iconColor = getNotificationColor(notification.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`p-6 hover:bg-gray-50 transition-all duration-200 ${
        !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className={`p-3 ${iconColor} rounded-xl text-white shadow-sm`}>
          <IconComponent className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`font-semibold ${
                !notification.read ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {notification.title}
              </h3>
              <p className="text-gray-600 mt-1 leading-relaxed">
                {notification.message}
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <span className="text-sm text-gray-500">
                  {new Date(notification.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {!notification.read && (
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              {!notification.read && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleMarkAsRead}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                  title="Mark as read"
                >
                  <FaCheck className="w-4 h-4" />
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDismiss}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                title="Dismiss"
              >
                <FaTimes className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationCard;