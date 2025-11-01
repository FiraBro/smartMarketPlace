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

  // 🎨 Softer, pastel-like orange tones derived from #f9A03f
  const mainColor = "#f9a03f"; // Base (softer version)
  const mutedColor = "#fde6c3"; // Light warm cream background
  const borderColor = "#fcd7a2"; // Gentle border accent

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
        duration: 0.5, 
        delay: index * 0.07,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={{ 
        y: -1,
        boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.06)"
      }}
      className={`relative p-5 rounded-xl transition-all duration-300 overflow-hidden group ${
        !notification.read
          ? "bg-gradient-to-r from-orange-50/80 to-amber-50/70 border-l-4"
          : "bg-white border border-gray-100"
      }`}
      style={{
        borderLeftColor: !notification.read ? borderColor : "transparent",
      }}
    >
      {!notification.read && (
        <motion.div
          className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-300/60 to-amber-300/50"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.7, delay: index * 0.12 + 0.3 }}
        />
      )}

      {!notification.read && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-50/20 to-amber-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      <div className="flex items-start space-x-4 relative z-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 180, damping: 12 }}
          className="relative"
        >
          <div
            className="p-3 rounded-xl text-white shadow-md flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: mainColor }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <IconComponent className="w-4 h-4 relative z-10" />
          </div>

          {!notification.read && (
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-white"
              style={{ backgroundColor: mainColor }}
            />
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <motion.h3
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                className={`font-semibold text-sm sm:text-base ${
                  !notification.read ? "text-gray-800" : "text-gray-700"
                }`}
              >
                {notification.title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                className="text-gray-600 mt-1.5 text-sm leading-relaxed"
              >
                {notification.message}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                className="flex items-center space-x-3 mt-2 text-xs"
              >
                <span className="text-gray-500 font-medium bg-gray-100/80 px-2 py-1 rounded-full">
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
                    transition={{ type: "spring", stiffness: 250, damping: 15, delay: index * 0.1 + 0.6 }}
                    className="inline-flex items-center space-x-1.5"
                  >
                    <span 
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: mainColor }}
                    />
                    <span className="text-xs font-medium tracking-wide text-gray-600">
                      Unread
                    </span>
                  </motion.span>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
              className="flex items-center space-x-1 ml-3"
            >
              {!notification.read && (
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: mutedColor }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMarkAsRead}
                  className="p-2 rounded-lg transition-all duration-300 border border-amber-200 shadow-sm"
                  style={{
                    color: mainColor,
                    backgroundColor: "#fffaf3",
                  }}
                  title="Mark as read"
                >
                  <FaCheck className="w-3.5 h-3.5" />
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#fef2f2", color: "#ef4444" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDismiss}
                className="p-2 text-gray-400 rounded-lg border border-gray-200 transition-all duration-300 shadow-sm"
                title="Dismiss"
              >
                <FaTimes className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationCard;
