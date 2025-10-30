// src/components/NotificationHeader.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaCheck, FaSync, FaBolt } from 'react-icons/fa';

const NotificationHeader = ({ 
  unreadCount, 
  onMarkAllAsRead, 
  onRefresh, 
  onTestNotification,
  loading,
  isConnected,
  activeTab
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className={`p-3 rounded-2xl shadow-lg ${
              isConnected 
                ? 'bg-gradient-to-br from-green-500 to-green-600' 
                : 'bg-gradient-to-br from-blue-500 to-blue-600'
            }`}>
              <FaBell className="w-8 h-8 text-white" />
            </div>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1 min-w-6 h-6 flex items-center justify-center shadow-lg"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0 
                ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                : 'All caught up!'
              }
              {isConnected && ' • Live updates'}
              {activeTab !== 'all' && ` • Showing ${activeTab} only`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Test Real-time Notification Buttons */}
          {isConnected && (
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTestNotification(activeTab)}
                className="flex items-center space-x-2 px-4 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-all duration-200 shadow-sm"
              >
                <FaBolt className="w-4 h-4" />
                <span>Test {activeTab}</span>
              </motion.button>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            disabled={loading}
            className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 disabled:opacity-50"
          >
            <FaSync className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </motion.button>

          {unreadCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMarkAllAsRead}
              className="flex items-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all duration-200 shadow-sm"
            >
              <FaCheck className="w-4 h-4" />
              <span>Mark {activeTab === 'all' ? 'All' : activeTab} Read</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationHeader;