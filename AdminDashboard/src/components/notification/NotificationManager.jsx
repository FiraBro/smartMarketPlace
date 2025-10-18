import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAdminNotifications } from "../../hooks/useAdminNotification";
import { CheckIcon, BellIcon } from "@heroicons/react/24/outline";
import CustomSelect from "../common/CustomSelect";

export default function NotificationManager() {
  const { sendNotification, loading, error } = useAdminNotifications();

  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    channel: "in-app",
    type: "info",
    recipientType: "all", // all | users | sellers
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let recipientType = "all";
    if (formData.recipientType === "users") recipientType = "buyer";
    if (formData.recipientType === "sellers") recipientType = "seller";

    const notificationData = {
      title: formData.subject,
      message: formData.message,
      channel: formData.channel,
      type: formData.type,
      recipientType,
    };

    console.log("📤 Sending notification:", notificationData);
    await sendNotification(notificationData);
    setFormData({
      subject: "",
      message: "",
      channel: "in-app",
      type: "info",
      recipientType: "all",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto mt-10 p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-[#f9a03f]/60"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#f9a03f]/20 rounded-full">
          <BellIcon className="h-6 w-6 text-[#f9a03f]" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">
          Send Notification
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="Enter subject"
            className="w-full px-4 py-2.5 border border-[#f9a03f]/40 rounded-lg shadow-sm focus:ring-2 focus:ring-[#f9a03f] focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Write your message here..."
            rows={4}
            className="w-full px-4 py-2.5 border border-[#f9a03f]/40 rounded-lg shadow-sm focus:ring-2 focus:ring-[#f9a03f] focus:outline-none transition resize-none"
          ></textarea>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <CustomSelect
            label="Channel"
            value={formData.channel}
            onChange={(val) => setFormData({ ...formData, channel: val })}
            options={[
              { value: "in-app", label: "In-App" },
              { value: "email", label: "Email" },
              { value: "both", label: "Both" },
            ]}
          />

          <CustomSelect
            label="Type"
            value={formData.type}
            onChange={(val) => setFormData({ ...formData, type: val })}
            options={[
              { value: "info", label: "Info" },
              { value: "alert", label: "Alert" },
              { value: "reminder", label: "Reminder" },
            ]}
          />

          <CustomSelect
            label="Recipient Type"
            value={formData.recipientType}
            onChange={(val) => setFormData({ ...formData, recipientType: val })}
            options={[
              { value: "all", label: "All Users" },
              { value: "users", label: "Buyers Only" },
              { value: "sellers", label: "Sellers Only" },
            ]}
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 p-2 rounded-md border border-red-200">
            {error}
          </p>
        )}

        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#f9a03f] text-white font-medium px-4 py-3 rounded-lg shadow-md hover:bg-[#faa64d] cursor-pointer transition"
        >
          {loading ? "Sending..." : "Send Notification"}
          <CheckIcon className="h-5 w-5" />
        </motion.button>
      </form>
    </motion.div>
  );
}
