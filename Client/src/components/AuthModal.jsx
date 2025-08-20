import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col p-8"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              ✕
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
              {isLogin ? "Welcome Back 👋" : "Create an Account 🚀"}
            </h2>

            {/* Form */}
            <form className="space-y-4">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {!isLogin && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              )}

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>

            {/* Toggle */}
            <p className="mt-6 text-center text-sm text-gray-600">
              {isLogin ? (
                <>
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Login
                  </button>
                </>
              )}
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
