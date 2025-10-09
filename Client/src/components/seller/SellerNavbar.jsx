import { motion } from "framer-motion";
import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";

export default function SellerNavbar({ toggleSidebar }) {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white border-b border-gray-200 flex justify-between items-center px-4 sm:px-6 py-4 shadow-sm"
    >
      <div className="flex items-center gap-3 py-1.5">
        {/* Hamburger for mobile */}
        <button
          className="text-gray-600 hover:text-blue-600 lg:hidden"
          onClick={toggleSidebar}
        >
          <FaBars size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Welcome Back</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-gray-600 hover:text-blue-600 focus:outline-none">
          <FaBell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>
        <FaUserCircle size={28} className="text-gray-600" />
      </div>
    </motion.header>
  );
}
