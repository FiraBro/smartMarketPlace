// src/components/EmptyState.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaBell, 
  FaInfoCircle, 
  FaExclamationTriangle, 
  FaClock, 
  FaShoppingBag, 
  FaDollarSign 
} from 'react-icons/fa';

const EmptyState = ({ type = 'all' }) => {
  const getEmptyStateConfig = (type) => {
    const configs = {
      all: {
        icon: FaBell,
        title: 'No notifications yet',
        message: 'We\'ll notify you when something important happens. Stay tuned!',
        color: 'text-gray-400',
        bgColor: 'bg-gray-100'
      },
      info: {
        icon: FaInfoCircle,
        title: 'No information notifications',
        message: 'You\'re all caught up with system updates and information.',
        color: 'text-blue-400',
        bgColor: 'bg-blue-100'
      },
      alert: {
        icon: FaExclamationTriangle,
        title: 'No alerts right now',
        message: 'Great! There are no urgent alerts requiring your attention.',
        color: 'text-red-400',
        bgColor: 'bg-red-100'
      },
      reminder: {
        icon: FaClock,
        title: 'No pending reminders',
        message: 'You\'re on top of all your tasks. No reminders at the moment.',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-100'
      },
      order: {
        icon: FaShoppingBag,
        title: 'No order notifications',
        message: 'You\'ll see order updates here when customers place new orders.',
        color: 'text-green-400',
        bgColor: 'bg-green-100'
      },
      payment: {
        icon: FaDollarSign,
        title: 'No payment notifications',
        message: 'Payment confirmations and updates will appear here.',
        color: 'text-purple-400',
        bgColor: 'bg-purple-100'
      }
    };

    return configs[type] || configs.all;
  };

  const config = getEmptyStateConfig(type);
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16 px-6"
    >
      <div className="max-w-md mx-auto">
        <div className={`w-20 h-20 ${config.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
          <IconComponent className={`w-10 h-10 ${config.color}`} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {config.title}
        </h3>
        <p className="text-gray-600 mb-6">
          {config.message}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
        >
          Check for Updates
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EmptyState;