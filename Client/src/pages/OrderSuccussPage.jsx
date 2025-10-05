// src/pages/OrderSuccessPage.jsx
import React from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const OrderSuccessPage = () => {
  const { orderId } = useParams();

  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh] px-6 text-center bg-gradient-to-b from-blue-50 to-white">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="text-blue-600 mb-6"
      >
        <FaCheckCircle size={90} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold text-gray-800 mb-3"
      >
        Order Confirmed!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 text-lg max-w-lg mb-8"
      >
        Thank you for shopping with us! 🎉 <br />
        Your order{" "}
        <span className="font-mono text-blue-700 font-semibold">
          {orderId}
        </span>{" "}
        has been successfully placed.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link
          to="/orders"
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-500 transition-all"
        >
          Track My Orders
        </Link>
        <Link
          to="/"
          className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold shadow-md hover:bg-gray-200 transition-all"
        >
          Back to Home
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 text-gray-400 text-sm"
      >
        <p>We’ve sent you an email confirmation with your order details.</p>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
