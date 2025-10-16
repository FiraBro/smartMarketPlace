// src/components/users/SellerTable.jsx
import React, { useState } from "react";
import DataTable from "../common/DataTable";
import StatusBadge from "../common/StatusBadge";
import SellerDetailModal from "./SellerDetailModal";

export default function SellerTable({ filters }) {
  const [selectedSeller, setSelectedSeller] = useState(null);

  const sellers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      company: "Tech Gadgets Inc.",
      joinDate: "2024-01-15",
      status: "approved",
      totalSales: 125000,
      commissionRate: "15%",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      company: "Fashion Store",
      joinDate: "2024-02-01",
      status: "pending",
      totalSales: 0,
      commissionRate: "12%",
    },
  ];

  const columns = [
    { key: "name", title: "Seller Name" },
    { key: "email", title: "Email" },
    { key: "company", title: "Company" },
    {
      key: "status",
      title: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: "totalSales",
      title: "Total Sales",
      render: (value) => `$${value.toLocaleString()}`,
    },
    { key: "commissionRate", title: "Commission Rate" },
  ];

  const actions = (seller) => (
    <div className="flex space-x-2">
      <button className="text-blue-600 hover:text-blue-900 text-sm">
        Edit
      </button>
      <button className="text-red-600 hover:text-red-900 text-sm">
        Suspend
      </button>
    </div>
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={sellers}
        onRowClick={setSelectedSeller}
        actions={actions}
      />

      <SellerDetailModal
        seller={selectedSeller}
        isOpen={!!selectedSeller}
        onClose={() => setSelectedSeller(null)}
      />
    </>
  );
}
