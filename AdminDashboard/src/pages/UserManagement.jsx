// src/pages/UserManagement.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import SellerManagement from "../components/user/SellerManagement";
import BuyerManagement from "../components/user/BuyerManagement";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("sellers");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "sellers", name: "Seller Management", count: 1247 },
            { id: "buyers", name: "Buyer Management", count: 23489 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.name}
              <span className="ml-2 py-0.5 px-2 text-xs bg-gray-200 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "sellers" && <SellerManagement />}
        {activeTab === "buyers" && <BuyerManagement />}
      </motion.div>
    </motion.div>
  );
}
