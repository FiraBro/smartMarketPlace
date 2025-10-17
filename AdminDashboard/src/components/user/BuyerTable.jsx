// src/components/users/BuyerTable.jsx
import React, { useState, useMemo } from "react";
import DataTable from "../common/DataTable";
import StatusBadge from "../common/StatusBadge";
import BuyerDetailModal from "./BuyerDetailModal";

export default function BuyerTable({ buyers = [], filters = {} }) {
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  // Filter buyers dynamically based on filters
  const filteredBuyers = useMemo(() => {
    return buyers.filter((buyer) => {
      const matchesStatus =
        filters.status === "all" || buyer.status === filters.status;
      const matchesSearch =
        !filters.search ||
        buyer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        buyer.email.toLowerCase().includes(filters.search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [buyers, filters]);

  // Define columns dynamically
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
      render: (value) =>
        value != null ? `$${Number(value).toLocaleString()}` : "$0",
    },
    {
      key: "lastActive",
      title: "Last Active",
      render: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    },
    { key: "location", title: "Location" },
  ];

  // Dynamic actions
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
      {buyer.status !== "suspended" ? (
        <button className="text-red-600 hover:text-red-900 text-sm">
          Suspend
        </button>
      ) : (
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
        data={filteredBuyers}
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
