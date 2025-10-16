// src/components/notifications/NotificationTemplates.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

export default function NotificationTemplates() {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: "Welcome Email",
      type: "email",
      category: "user",
      subject: "Welcome to Our Platform!",
      lastModified: "2024-03-10",
      createdBy: "Admin User",
    },
    {
      id: 2,
      name: "Order Confirmation",
      type: "email",
      category: "user",
      subject: "Your Order #{order_id} is Confirmed",
      lastModified: "2024-03-08",
      createdBy: "Admin User",
    },
    {
      id: 3,
      name: "Seller Onboarding",
      type: "email",
      category: "seller",
      subject: "Welcome to Our Seller Community!",
      lastModified: "2024-03-05",
      createdBy: "Admin User",
    },
    {
      id: 4,
      name: "Price Drop Alert",
      type: "push",
      category: "user",
      subject: "Price dropped on items in your wishlist!",
      lastModified: "2024-03-01",
      createdBy: "Admin User",
    },
  ]);

  const getCategoryColor = (category) => {
    switch (category) {
      case "user":
        return "bg-blue-100 text-blue-800";
      case "seller":
        return "bg-green-100 text-green-800";
      case "all":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "email":
        return "📧";
      case "push":
        return "🔔";
      case "sms":
        return "📱";
      default:
        return "✉️";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Notification Templates
          </h2>
          <p className="text-sm text-gray-600">
            Manage reusable notification templates
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <PlusIcon className="h-4 w-4" />
          <span>New Template</span>
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getTypeIcon(template.type)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {template.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                      template.category
                    )}`}
                  >
                    {template.category}
                  </span>
                </div>
              </div>
              <div className="flex space-x-1">
                <button className="text-gray-400 hover:text-blue-600 p-1">
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-green-600 p-1">
                  <DocumentDuplicateIcon className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-red-600 p-1">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Subject</p>
                <p className="text-sm font-medium text-gray-900">
                  {template.subject}
                </p>
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  Modified:{" "}
                  {new Date(template.lastModified).toLocaleDateString()}
                </span>
                <span>By: {template.createdBy}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full bg-blue-50 text-blue-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors">
                Use Template
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {templates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📧</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No templates yet
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first notification template to get started
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create Template
          </button>
        </div>
      )}
    </div>
  );
}
