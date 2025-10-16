import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NotificationManager from "../components/notification/NotificationManager";
import NotificationHistory from "../components/notification/NotificationHistory";
import NotificationTemplates from "../components/notification/NotificationTemplate";
import { useAdminNotifications } from "../hooks/useAdminNotification";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("send");
  const { notifications, fetchHistory } = useAdminNotifications();

  // Fetch notifications count when component mounts
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-600 mt-1">
            Send notifications to users and sellers, manage templates, and view
            history
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "send", name: "Send Notification", count: null },
            {
              id: "history",
              name: "Notification History",
              count: notifications.length,
            },
            { id: "templates", name: "Templates", count: 0 }, // templates count later
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
              {tab.count !== null && (
                <span className="ml-2 py-0.5 px-2 text-xs bg-gray-200 rounded-full">
                  {tab.count}
                </span>
              )}
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
        {activeTab === "send" && <NotificationManager />}
        {activeTab === "history" && <NotificationHistory />}
        {activeTab === "templates" && <NotificationTemplates />}
      </motion.div>
    </motion.div>
  );
}
