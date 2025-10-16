// src/components/notifications/NotificationManager.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EnvelopeIcon, BellIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useAdminNotifications } from "../../hooks/useAdminNotification";
export default function NotificationManager() {
  const { sendNotification, loading, error } = useAdminNotifications();
  const [formData, setFormData] = useState({
    recipientType: "all",
    targetUsers: "all",
    targetSellers: "all",
    specificUsers: [],
    specificSellers: [],
    channel: "in_app",
    subject: "",
    message: "",
    type: "info",
    schedule: "immediately",
    scheduledDate: "",
    scheduledTime: "",
  });
  const [success, setSuccess] = useState("");
  const [errorMessage, setError] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const notificationData = {
        recipientType: formData.recipientType,
        specificUsers: formData.specificUsers,
        specificSellers: formData.specificSellers,
        channel: formData.channel,
        subject: formData.subject,
        message: formData.message,
        type: formData.type,
        schedule: formData.schedule,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
      };

      const result = await sendNotification(notificationData);
      setSuccess(result.message);

      // Reset form on success
      setFormData({
        recipientType: "all",
        specificUsers: [],
        specificSellers: [],
        channel: "in_app",
        subject: "",
        message: "",
        type: "info",
        schedule: "immediately",
        scheduledDate: "",
        scheduledTime: "",
      });
    } catch (err) {
      // Error is already set by the hook
    }
  };

  const recipientOptions = [
    { id: "all", name: "All Users & Sellers" },
    { id: "users", name: "Users Only" },
    { id: "sellers", name: "Sellers Only" },
    { id: "specific", name: "Specific Users/Sellers" },
  ];

  const channelTypes = [
    {
      id: "in_app",
      name: "In-App Only",
      icon: BellIcon,
      description: "Show in user notification center",
    },
    {
      id: "email",
      name: "Email Only",
      icon: EnvelopeIcon,
      description: "Send via email",
    },
    {
      id: "both",
      name: "Both Channels",
      icon: CheckIcon,
      description: "In-app notification and email",
    },
  ];

  const notificationTypes = [
    { id: "info", name: "Info", color: "bg-blue-100 text-blue-800" },
    { id: "success", name: "Success", color: "bg-green-100 text-green-800" },
    { id: "warning", name: "Warning", color: "bg-yellow-100 text-yellow-800" },
    { id: "error", name: "Error", color: "bg-red-100 text-red-800" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Send New Notification
        </h2>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md"
          >
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md"
          >
            <p className="text-red-800 font-medium">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Recipient Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recipients
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recipientOptions.map((option) => (
                <motion.label
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                    formData.recipientType === option.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="recipientType"
                    value={option.id}
                    checked={formData.recipientType === option.id}
                    onChange={(e) =>
                      handleInputChange("recipientType", e.target.value)
                    }
                    className="sr-only"
                  />
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <div
                          className={`font-medium ${
                            formData.recipientType === option.id
                              ? "text-blue-900"
                              : "text-gray-900"
                          }`}
                        >
                          {option.name}
                        </div>
                      </div>
                    </div>
                    {formData.recipientType === option.id && (
                      <div className="shrink-0 text-blue-600">
                        <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.label>
              ))}
            </div>

            {/* Specific Users/Sellers Selection */}
            {formData.recipientType === "specific" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Users
                    </label>
                    <select
                      multiple
                      value={formData.specificUsers}
                      onChange={(e) =>
                        handleInputChange(
                          "specificUsers",
                          Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                          )
                        )
                      }
                      className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="user1">
                        Alice Johnson (alice@example.com)
                      </option>
                      <option value="user2">Bob Smith (bob@example.com)</option>
                      <option value="user3">
                        Carol Davis (carol@example.com)
                      </option>
                      <option value="user4">
                        David Wilson (david@example.com)
                      </option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Hold Ctrl/Cmd to select multiple users
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Sellers
                    </label>
                    <select
                      multiple
                      value={formData.specificSellers}
                      onChange={(e) =>
                        handleInputChange(
                          "specificSellers",
                          Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                          )
                        )
                      }
                      className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="seller1">Tech Gadgets Inc.</option>
                      <option value="seller2">Fashion Store</option>
                      <option value="seller3">Sports Gear Co.</option>
                      <option value="seller4">Home Essentials</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Hold Ctrl/Cmd to select multiple sellers
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Channel Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Notification Channel
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {channelTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <motion.label
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                      formData.channel === type.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="channel"
                      value={type.id}
                      checked={formData.channel === type.id}
                      onChange={(e) =>
                        handleInputChange("channel", e.target.value)
                      }
                      className="sr-only"
                    />
                    <div className="flex w-full items-start space-x-3">
                      <IconComponent
                        className={`h-6 w-6 ${
                          formData.channel === type.id
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm font-medium ${
                            formData.channel === type.id
                              ? "text-blue-900"
                              : "text-gray-900"
                          }`}
                        >
                          {type.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {type.description}
                        </div>
                      </div>
                    </div>
                  </motion.label>
                );
              })}
            </div>
          </div>

          {/* Notification Type */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Notification Type
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {notificationTypes.map((type) => (
                <motion.label
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                    formData.type === type.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type.id}
                    checked={formData.type === type.id}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex w-full items-center justify-between">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${type.color}`}
                    >
                      {type.name}
                    </span>
                    {formData.type === type.id && (
                      <div className="shrink-0 text-blue-600">
                        <div className="h-4 w-4 rounded-full bg-blue-600 flex items-center justify-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.label>
              ))}
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Message Content
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Enter notification subject..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Enter your notification message..."
                rows="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Scheduling */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.label
                whileHover={{ scale: 1.02 }}
                className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                  formData.schedule === "immediately"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="schedule"
                  value="immediately"
                  checked={formData.schedule === "immediately"}
                  onChange={(e) =>
                    handleInputChange("schedule", e.target.value)
                  }
                  className="sr-only"
                />
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <div
                        className={`font-medium ${
                          formData.schedule === "immediately"
                            ? "text-blue-900"
                            : "text-gray-900"
                        }`}
                      >
                        Send Immediately
                      </div>
                    </div>
                  </div>
                </div>
              </motion.label>

              <motion.label
                whileHover={{ scale: 1.02 }}
                className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                  formData.schedule === "scheduled"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="schedule"
                  value="scheduled"
                  checked={formData.schedule === "scheduled"}
                  onChange={(e) =>
                    handleInputChange("schedule", e.target.value)
                  }
                  className="sr-only"
                />
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <div
                        className={`font-medium ${
                          formData.schedule === "scheduled"
                            ? "text-blue-900"
                            : "text-gray-900"
                        }`}
                      >
                        Schedule for Later
                      </div>
                    </div>
                  </div>
                </div>
              </motion.label>
            </div>

            {formData.schedule === "scheduled" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) =>
                      handleInputChange("scheduledDate", e.target.value)
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) =>
                      handleInputChange("scheduledTime", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Notification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
