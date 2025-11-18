// src/components/users/BuyerTable.jsx
import React, { useState, useMemo } from "react";
import DataTable from "../../components/common/DataTable";
import StatusBadge from "../../components/common/StatsBadge";
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

  return (
    <>
      <DataTable
        columns={columns}
        data={filteredBuyers}
        onRowClick={setSelectedBuyer}
      />

      <BuyerDetailModal
        buyer={selectedBuyer}
        isOpen={!!selectedBuyer}
        onClose={() => setSelectedBuyer(null)}
      />
    </>
  );
}
