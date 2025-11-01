// src/components/NotificationTabs.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaInfoCircle, 
  FaExclamationTriangle, 
  FaClock, 
  FaShoppingBag, 
  FaDollarSign,
  FaThList 
} from 'react-icons/fa';

const NotificationTabs = ({ activeTab, setActiveTab, counts, unreadCounts }) => {
  const tabs = [
    { id: 'all', label: 'All', icon: FaThList, color: 'text-gray-600' },
    { id: 'info', label: 'Information', icon: FaInfoCircle, color: 'text-blue-600' },
    { id: 'alert', label: 'Alerts', icon: FaExclamationTriangle, color: 'text-red-600' },
    { id: 'reminder', label: 'Reminders', icon: FaClock, color: 'text-yellow-600' },
    { id: 'order', label: 'Orders', icon: FaShoppingBag, color: 'text-green-600' },
    { id: 'payment', label: 'Payments', icon: FaDollarSign, color: 'text-purple-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6"
    >
      <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const count = counts[tab.id] || 0;
          const unreadCount = unreadCounts[tab.id] || 0;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'bg-white text-gray-900 shadow-md border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isActive ? tab.color : ''}`} />
              <span>{tab.label}</span>
              
              {/* Count Badge */}
              {count > 0 && (
                <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {count}
                </span>
              )}
              
              {/* Unread Indicator */}
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-2 h-2 rounded-full ${
                    isActive ? 'bg-blue-500' : 'bg-red-500'
                  }`}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default NotificationTabs;