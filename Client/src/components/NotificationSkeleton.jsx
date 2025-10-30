// src/components/NotificationSkeleton.jsx
import React from 'react';
import { motion } from 'framer-motion';

const NotificationSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 animate-pulse"
    >
      <div className="flex items-start space-x-4">
        {/* Icon skeleton */}
        <div className="w-11 h-11 bg-gray-200 rounded-xl"></div>
        
        {/* Content skeleton */}
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          <div className="flex space-x-4">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-3"></div>
          </div>
        </div>

        {/* Actions skeleton */}
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationSkeleton;