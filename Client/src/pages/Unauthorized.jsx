import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full text-center bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-2xl border border-orange-100"
      >
        <motion.div
          initial={{ rotate: -10, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <FaExclamationTriangle className="mx-auto text-orange-500 text-6xl drop-shadow-md" />
        </motion.div>

        <h1 className="text-3xl font-extrabold text-gray-800 mb-3">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Oops! You don’t have permission to access this page. Please log in or
          ensure your account has the required privileges.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-300"
        >
          <FaHome className="text-lg" />
          Go to Home
        </Link>

        <p className="text-gray-400 mt-6 text-sm">
          If you believe this is a mistake, please contact{" "}
          <span className="text-orange-500 font-medium">support</span>.
        </p>
      </motion.div>
    </div>
  );
}
