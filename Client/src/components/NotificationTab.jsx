import { motion } from 'framer-motion';
import { 
  FaInfoCircle, 
  FaExclamationTriangle, 
  FaClock, 
  FaShoppingBag, 
  FaDollarSign,
  FaThList 
} from 'react-icons/fa';

const NotificationTabs = ({
  activeTab,
  setActiveTab,
  counts = {},       // default empty object
  unreadCounts = {}, // default empty object
  role = 'buyer'     // default to buyer
}) => {
  // All possible tabs
  const allTabs = [
    { id: 'all', label: 'All', icon: FaThList, color: 'text-gray-600' },
    { id: 'info', label: 'Information', icon: FaInfoCircle, color: 'text-blue-600' },
    { id: 'alert', label: 'Alerts', icon: FaExclamationTriangle, color: 'text-red-600' },
    { id: 'reminder', label: 'Reminders', icon: FaClock, color: 'text-yellow-600' },
    { id: 'order', label: 'Orders', icon: FaShoppingBag, color: 'text-green-600' },
    { id: 'payment', label: 'Payments', icon: FaDollarSign, color: 'text-purple-600' },
  ];

  // Filter tabs based on role
  const tabs = allTabs.filter(tab => {
    if (role === 'buyer') {
      return ['all', 'info', 'reminder', 'order'].includes(tab.id);
    }
    // Seller sees all tabs
    return true;
  });

  return (
    <motion.div className="mb-6">
      <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const count = counts[tab.id] || 0;
          const unreadCount = unreadCounts[tab.id] || 0;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition ${
                isActive ? 'bg-gray-200' : 'bg-white hover:bg-gray-100'
              }`}
            >
              <IconComponent className={tab.color} />
              <span>{tab.label}</span>
              {count > 0 && <span className="text-sm text-gray-500">({count})</span>}
              {unreadCount > 0 && <span className="text-sm text-red-500">•</span>}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default NotificationTabs;
