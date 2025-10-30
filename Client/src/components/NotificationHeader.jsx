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
  // 🔶 Using the same main color from NotificationCard
  const mainColor = "#f9A03f";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="mb-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Section - Branding & Status */}
        <div className="flex items-center space-x-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.6,
              type: "spring",
              stiffness: 200
            }}
            className="relative"
          >
            <div 
              className="p-4 rounded-2xl shadow-lg relative overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${mainColor} 0%, #f97316 100%)`
              }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <FaBell className="w-7 h-7 text-white relative z-10" />
            </div>
            
            {/* Unread count badge with pulse animation */}
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 400
                }}
                className="absolute -top-2 -right-2 text-white text-xs font-bold rounded-full px-2 py-1 min-w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white"
                style={{ backgroundColor: mainColor }}
              >
                <motion.span
                  key={unreadCount}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </motion.span>
              </motion.div>
            )}
          </motion.div>

          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-3xl font-bold text-gray-900 tracking-tight"
            >
              Notifications
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-wrap items-center gap-2 mt-2"
            >
              {/* Status indicators */}
              <div className="flex items-center space-x-3 text-sm">
                <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full font-medium ${
                  unreadCount > 0 
                    ? "bg-orange-100 text-gray-800" 
                    : "bg-green-100 text-green-800"
                }`}>
                  <span 
                    className={`w-2 h-2 rounded-full ${
                      unreadCount > 0 ? "animate-pulse" : ""
                    }`}
                    style={{ 
                      backgroundColor: unreadCount > 0 ? mainColor : "#10b981" 
                    }}
                  />
                  <span>
                    {unreadCount > 0 
                      ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                      : 'All caught up! 🎉'
                    }
                  </span>
                </span>

                {isConnected && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Live updates</span>
                  </span>
                )}

                {activeTab !== 'all' && (
                  <span 
                    className="inline-flex items-center space-x-1 px-3 py-1 rounded-full font-medium text-white"
                    style={{ backgroundColor: mainColor }}
                  >
                    <span>Showing {activeTab} only</span>
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center justify-end space-x-3 flex-wrap gap-3"
        >
          {/* Test Real-time Notification Button */}
          {isConnected && (
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(249, 160, 63, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTestNotification(activeTab)}
              className="flex items-center space-x-2 px-5 py-3 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg border-2 border-transparent"
              style={{ 
                backgroundColor: mainColor,
                background: `linear-gradient(135deg, ${mainColor} 0%, #ea580c 100%)`
              }}
            >
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.4 }}
              >
                <FaBolt className="w-4 h-4" />
              </motion.div>
              <span>Test {activeTab}</span>
            </motion.button>
          )}

          {/* Refresh Button */}
          <motion.button
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "#fff7ed",
              color: mainColor
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            disabled={loading}
            className="p-3 text-gray-500 rounded-xl transition-all duration-200 disabled:opacity-50 border-2 border-gray-200 shadow-sm"
            title="Refresh notifications"
          >
            <FaSync className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </motion.button>

          {/* Mark All as Read Button */}
          {unreadCount > 0 && (
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={onMarkAllAsRead}
              className="flex items-center space-x-2 px-5 py-3 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg border-2 border-transparent bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.2 }}
              >
                <FaCheck className="w-4 h-4" />
              </motion.div>
              <span>Mark {activeTab === 'all' ? 'All' : activeTab} Read</span>
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Connection Status Bar */}
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "100%" }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-6 h-1 rounded-full bg-gradient-to-r from-gray-200 via-gray-200 to-gray-200 overflow-hidden"
      >
        {isConnected && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="h-full bg-gradient-to-r from-transparent via-green-500 to-transparent"
            style={{ width: "50%" }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default NotificationHeader;