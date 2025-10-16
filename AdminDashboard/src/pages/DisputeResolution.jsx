// src/pages/DisputeResolution.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function DisputeResolution() {
  const [activeTab, setActiveTab] = useState("open");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dispute Resolution</h1>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "open", name: "Open Disputes", count: 8 },
            { id: "closed", name: "Closed Disputes", count: 124 },
            { id: "support", name: "Support Tickets", count: 23 },
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

      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="text-center text-gray-500 py-8">
          Dispute management interface for {activeTab} cases
        </div>
      </motion.div>
    </motion.div>
  );
}
