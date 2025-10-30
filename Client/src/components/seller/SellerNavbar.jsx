import { motion } from "framer-motion";
import { FaUserCircle, FaBars, FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext"; // Adjust path as needed

export default function SellerNavbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const { unreadCount, loading } = useNotification();

  console.log('Navbar rendering with REAL unreadCount:', unreadCount);

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-white border-b border-gray-100 flex justify-between items-center px-6 py-4 shadow-sm relative"
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Enhanced Hamburger Button */}
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#fff7ed" }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className="p-2.5 text-gray-600 hover:text-orange-600 rounded-xl transition-all duration-200 lg:hidden border border-gray-200 hover:border-orange-200"
        >
          <FaBars size={20} />
        </motion.button>

        {/* Welcome Text with Enhanced Design */}
        <div className="flex flex-col">
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
          >
            Welcome Back
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm text-gray-500 font-medium"
          >
            Ready to grow your business today
          </motion.p>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-3">
        {/* Real Notification Bell with Actual Count from Context */}
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#fff7ed" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/seller/notifications")}
          className="group relative p-2.5 rounded-xl transition-all duration-300 hover:shadow-md border border-transparent hover:border-orange-200"
          title={`${unreadCount} unread notifications`}
          disabled={loading}
        >
          <FaBell 
            size={20} 
            className={`transition-colors duration-300 ${
              loading 
                ? 'text-gray-300' 
                : 'text-gray-500 group-hover:text-orange-500'
            }`} 
          />
          
          {/* Real Notification Count Badge from Context */}
          {!loading && unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 min-w-5 h-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm px-1"
            >
              <motion.span
                key={unreadCount}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.span>
            </motion.div>
          )}

          {/* Loading indicator */}
          {loading && unreadCount === 0 && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1 -right-1 w-3 h-3 border-2 border-orange-200 border-t-orange-500 rounded-full"
            />
          )}
          
          {/* Hover effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>

        {/* Enhanced Profile Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/seller/profile")}
          className="group relative p-2.5 rounded-xl transition-all duration-300 hover:shadow-md border border-transparent hover:border-orange-200 hover:bg-orange-50"
        >
          <FaUserCircle 
            size={32} 
            className="text-gray-500 group-hover:text-orange-500 transition-colors duration-300" 
          />
          
          {/* Hover effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>

        {/* Desktop Menu Button (Hidden on mobile) */}
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#fff7ed" }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className="hidden lg:flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-orange-600 rounded-xl transition-all duration-200 border border-gray-200 hover:border-orange-200"
        >
          <FaBars size={16} />
          <span className="text-sm font-semibold">Menu</span>
        </motion.button>
      </div>

      {/* Subtle Bottom Gradient Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-orange-200 to-transparent"
      />
    </motion.header>
  );
}