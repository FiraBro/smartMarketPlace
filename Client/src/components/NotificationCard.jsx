// src/components/NotificationCard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaCheck,
  FaTimes,
  FaShoppingBag,
  FaDollarSign,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

const NotificationCard = ({ notification, onMarkAsRead, index }) => {
  const [isVisible, setIsVisible] = useState(true);

  const iconMap = {
    order: FaShoppingBag,
    payment: FaDollarSign,
    alert: FaExclamationTriangle,
    info: FaInfoCircle,
  };

  // 🔶 Use #f9A03f for all main accents
  const mainColor = "#f9A03f";

  const IconComponent = iconMap[notification.type] || FaInfoCircle;

  const handleMarkAsRead = () => {
    if (onMarkAsRead && notification._id) onMarkAsRead(notification._id);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={{ 
        y: -2,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)"
      }}
      className={`relative p-6 rounded-2xl transition-all duration-300 overflow-hidden group ${
        !notification.read
          ? "bg-gradient-to-r from-orange-50 to-amber-50 border-l-4"
          : "bg-white border border-gray-100"
      }`}
      style={{
        borderLeftColor: !notification.read ? mainColor : "transparent",
      }}
    >
      {/* Animated background accent */}
      {!notification.read && (
        <motion.div
          className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-amber-400"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
        />
      )}
      
      {/* Glow effect for unread notifications */}
      {!notification.read && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-100/20 to-amber-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      <div className="flex items-start space-x-4 relative z-10">
        {/* Enhanced Icon Container */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: index * 0.1,
            type: "spring",
            stiffness: 200
          }}
          whileHover={{ 
            scale: 1.1,
            rotate: 5,
            transition: { duration: 0.2 }
          }}
          className="relative"
        >
          <div
            className="p-3 rounded-xl text-white shadow-lg flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: mainColor }}
          >
            {/* Icon shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            <IconComponent className="w-5 h-5 relative z-10" />
          </div>
          
          {/* Pulse dot for unread notifications */}
          {!notification.read && (
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.7, 0, 0.7]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                delay: index * 0.2
              }}
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
              style={{ backgroundColor: mainColor }}
            />
          )}
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                className={`font-bold text-sm sm:text-base tracking-tight ${
                  !notification.read ? "text-gray-900" : "text-gray-700"
                }`}
              >
                {notification.title}
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                className="text-gray-600 mt-2 text-sm leading-relaxed"
              >
                {notification.message}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
                className="flex items-center space-x-4 mt-3 text-xs"
              >
                <span className="text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">
                  {new Date(notification.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                
                {!notification.read && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      delay: index * 0.1 + 0.5
                    }}
                    className="inline-flex items-center space-x-1"
                  >
                    <span 
                      className="inline-block w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: mainColor }}
                    />
                    <span 
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: mainColor }}
                    >
                      New
                    </span>
                  </motion.span>
                )}
              </motion.div>
            </div>

            {/* Enhanced Actions */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
              className="flex items-center space-x-1 ml-3"
            >
              {!notification.read && (
                <motion.button
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: mainColor,
                    color: "white"
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleMarkAsRead}
                  className="p-2 rounded-xl transition-all duration-200 border-2 shadow-sm"
                  style={{
                    color: mainColor,
                    backgroundColor: "#fff5e6",
                    borderColor: mainColor,
                  }}
                  title="Mark as read"
                >
                  <FaCheck className="w-4 h-4" />
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: "#fee2e2",
                  color: "#dc2626"
                }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDismiss}
                className="p-2 text-gray-400 rounded-xl border-2 border-transparent transition-all duration-200 shadow-sm"
                title="Dismiss"
              >
                <FaTimes className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationCard;