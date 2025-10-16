// src/components/users/BuyerTable.jsx
import React, { useState } from "react";
import DataTable from "../common/DataTable";
import StatusBadge from "../common/StatusBadge";
import BuyerDetailModal from "./BuyerDetailModal";
import { motion } from "framer-motion";

export default function BuyerTable({ filters }) {
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  const buyers = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+1-555-0125",
      joinDate: "2023-11-15",
      lastActive: "2024-03-10",
      status: "active",
      totalOrders: 15,
      totalSpent: 2450.75,
      location: "New York, NY",
      riskLevel: "low",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      phone: "+1-555-0126",
      joinDate: "2024-01-20",
      lastActive: "2024-03-15",
      status: "active",
      totalOrders: 8,
      totalSpent: 890.5,
      location: "Los Angeles, CA",
      riskLevel: "medium",
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol@example.com",
      phone: "+1-555-0127",
      joinDate: "2023-09-05",
      lastActive: "2024-01-15",
      status: "inactive",
      totalOrders: 3,
      totalSpent: 450.25,
      location: "Chicago, IL",
      riskLevel: "low",
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david@example.com",
      phone: "+1-555-0128",
      joinDate: "2024-02-28",
      lastActive: "2024-03-14",
      status: "flagged",
      totalOrders: 12,
      totalSpent: 3200.0,
      location: "Miami, FL",
      riskLevel: "high",
      flagReason: "Multiple chargebacks",
    },
  ];

  const columns = [
    { key: "name", title: "Buyer Name" },
    { key: "email", title: "Email" },
    {
      key: "status",
      title: "Status",
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <StatusBadge status={value} />
          {row.riskLevel === "high" && (
            <span className="text-red-500" title="High risk buyer">
              ⚠️
            </span>
          )}
        </div>
      ),
    },
    { key: "totalOrders", title: "Total Orders" },
    {
      key: "totalSpent",
      title: "Total Spent",
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      key: "lastActive",
      title: "Last Active",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    { key: "location", title: "Location" },
  ];

  const actions = (buyer) => (
    <div className="flex space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedBuyer(buyer);
        }}
        className="text-blue-600 hover:text-blue-900 text-sm"
      >
        View
      </button>
      <button className="text-green-600 hover:text-green-900 text-sm">
        Message
      </button>
      {buyer.status !== "suspended" && (
        <button className="text-red-600 hover:text-red-900 text-sm">
          Suspend
        </button>
      )}
      {buyer.status === "suspended" && (
        <button className="text-green-600 hover:text-green-900 text-sm">
          Unsuspend
        </button>
      )}
    </div>
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={buyers}
        onRowClick={setSelectedBuyer}
        actions={actions}
      />

      <BuyerDetailModal
        buyer={selectedBuyer}
        isOpen={!!selectedBuyer}
        onClose={() => setSelectedBuyer(null)}
      />
    </>
  );
}
