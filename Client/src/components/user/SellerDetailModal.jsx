// src/components/users/SellerDetailModal.jsx
import React, { useState } from "react";
import Modal from "../common/Modal";
import StatsBage from "../../components/common/StatsBadge";
export default function SellerDetailModal({ seller, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!seller) return null;

  const tabs = [
    { id: "overview", name: "Overview" },
    { id: "listings", name: "Listings" },
    { id: "orders", name: "Orders" },
    { id: "notes", name: "Admin Notes" },
  ];

  // Example data for seller listings/orders
  const listings = seller.listings || [];
  const orders = seller.orders || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Seller Details - ${seller.name}`}
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
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Full Name
                    </label>
                    <p className="text-gray-900">{seller.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-gray-900">{seller.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Phone
                    </label>
                    <p className="text-gray-900">{seller.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Location
                    </label>
                    <p className="text-gray-900">{seller.location}</p>
                  </div>
                </div>
              </div>

              {/* Account Stats */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">
                  Account Statistics
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <StatsBage status={seller.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Member Since</span>
                    <span className="text-sm text-gray-900">
                      {new Date(seller.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Total Listings
                    </span>
                    <span className="text-sm text-gray-900">
                      {listings.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Orders</span>
                    <span className="text-sm text-gray-900">
                      {orders.length}
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
                  {seller.status !== "suspended" ? (
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

          {activeTab === "listings" && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Seller Listings</h4>
              {listings.length === 0 ? (
                <p className="text-gray-500">No listings available.</p>
              ) : (
                <ul className="space-y-2">
                  {listings.map((item) => (
                    <li key={item.id} className="border p-3 rounded-md">
                      <div className="flex justify-between">
                        <span>{item.title}</span>
                        <span>${item.price}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Orders</h4>
              {orders.length === 0 ? (
                <p className="text-gray-500">No orders yet.</p>
              ) : (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 text-sm text-blue-600">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ${order.amount}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={order.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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
                {seller.notes?.length > 0 ? (
                  seller.notes.map((note, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900">
                          {note.author}
                        </span>
                        <span className="text-sm text-gray-500">
                          {note.date}
                        </span>
                      </div>
                      <p className="text-gray-700">{note.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No notes available.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
