// src/components/users/BuyerDetailModal.jsx
import React, { useState } from "react";
import Modal from "../common/Modal";
import StatusBadge from "../common/StatusBadge";

export default function BuyerDetailModal({ buyer, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!buyer) return null;

  const tabs = [
    { id: "overview", name: "Overview" },
    { id: "orders", name: "Order History" },
    { id: "behavior", name: "Behavior Analytics" },
    { id: "notes", name: "Admin Notes" },
  ];

  const safeNumber = (num) => (num !== undefined && num !== null ? num : 0);
  const safeDate = (date) => (date ? new Date(date).toLocaleDateString() : "-");

  const purchaseHistory = buyer.purchaseHistory || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Buyer Details - ${buyer.name}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
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
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">
                  Basic Information
                </h4>
                {["name", "email", "phone", "location"].map((key) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-gray-500">
                      {key.replace(/^\w/, (c) => c.toUpperCase())}
                    </label>
                    <p className="text-gray-900">{buyer[key] || "-"}</p>
                  </div>
                ))}
              </div>

              {/* Account Stats */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">
                  Account Statistics
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <StatusBadge status={buyer.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Risk Level</span>
                    <span
                      className={`text-sm font-medium ${
                        buyer.riskLevel === "high"
                          ? "text-red-600"
                          : buyer.riskLevel === "medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {buyer.riskLevel?.toUpperCase() || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Member Since</span>
                    <span className="text-sm text-gray-900">
                      {safeDate(buyer.joinDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Last Active</span>
                    <span className="text-sm text-gray-900">
                      {safeDate(buyer.lastActive)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Orders</span>
                    <span className="text-sm text-gray-900">
                      {safeNumber(buyer.totalOrders)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Lifetime Value
                    </span>
                    <span className="text-sm text-gray-900">
                      ${safeNumber(buyer.totalSpent).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="md:col-span-2 space-y-4">
                <h4 className="font-semibold text-gray-900">Quick Actions</h4>
                <div className="flex space-x-3">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
                    Send Message
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm">
                    Issue Refund
                  </button>
                  {buyer.status !== "suspended" ? (
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm">
                      Suspend Account
                    </button>
                  ) : (
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm">
                      Unsuspend Account
                    </button>
                  )}
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm">
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Recent Orders</h4>
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Order ID", "Date", "Amount", "Items", "Status"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {purchaseHistory.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {safeDate(order.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${safeNumber(order.amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {safeNumber(order.items)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={order.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "behavior" && (
            <div className="space-y-6">
              <h4 className="font-semibold text-gray-900">
                Behavior Analytics
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">
                    Average Order Value
                  </h5>
                  <p className="text-2xl font-bold text-blue-600">
                    $
                    {buyer.totalOrders
                      ? (buyer.totalSpent / buyer.totalOrders).toFixed(2)
                      : "0.00"}
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">
                    Purchase Frequency
                  </h5>
                  <p className="text-2xl font-bold text-green-600">
                    {buyer.totalOrders > 10
                      ? "High"
                      : buyer.totalOrders > 5
                      ? "Medium"
                      : "Low"}
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">
                    Activity Score
                  </h5>
                  <p className="text-2xl font-bold text-purple-600">
                    {buyer.status === "active" ? "85%" : "25%"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-900">Admin Notes</h4>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  Add Note
                </button>
              </div>
              <div className="space-y-3">
                {(buyer.notes || []).map((note, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">
                        {note.author}
                      </span>
                      <span className="text-sm text-gray-500">
                        {safeDate(note.date)}
                      </span>
                    </div>
                    <p className="text-gray-700">{note.content}</p>
                  </div>
                ))}
              </div>
              {/* Add Note Form */}
              <div className="border-t pt-4">
                <textarea
                  placeholder="Add a new note..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end mt-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
