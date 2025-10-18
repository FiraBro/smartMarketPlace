import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NotificationManager from "../components/notification/NotificationManager";
import NotificationHistory from "../components/notification/NotificationHistory";
import NotificationTemplates from "../components/notification/NotificationTemplate";
import { useAdminNotifications } from "../hooks/useAdminNotifications";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("send");

  // ⚡ Keep all state here
  const notificationsHook = useAdminNotifications();
  const { notifications, fetchHistory } = notificationsHook;

  // Fetch notifications on mount
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
            { id: "templates", name: "Templates", count: 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-[#f9A03f] text-gray-500 cursor-pointer"
                  : "border-transparent text-gray-500 hover:text-gray-700 cursor-pointer hover:border-[#faa46d]"
              }`}
            >
              {tab.name}
              {tab.count !== null && (
                <span className="ml-2 py-0.5 px-2 text-xs bg-[#faa46d] rounded-full">
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
        {activeTab === "send" && (
          <NotificationManager
            notificationsHook={notificationsHook} // pass hook to update state
            onSend={fetchHistory} // automatically refresh after sending
          />
        )}
        {activeTab === "history" && (
          <NotificationHistory notificationsHook={notificationsHook} />
        )}
        {activeTab === "templates" && <NotificationTemplates />}
      </motion.div>
    </motion.div>
  );
}
