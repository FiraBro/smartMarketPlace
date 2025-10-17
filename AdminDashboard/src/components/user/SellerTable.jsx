import React, { useState, useMemo } from "react";
import DataTable from "../common/DataTable";
import StatusBadge from "../common/StatusBadge";
import SellerDetailModal from "./SellerDetailModal";

export default function SellerTable({ users = [], filters }) {
  const [selectedSeller, setSelectedSeller] = useState(null);

  // Filter sellers based on filters
  const filteredSellers = useMemo(() => {
    return users.filter((seller) => {
      // Filter by status
      if (filters.status !== "all" && seller.status !== filters.status)
        return false;
      // Filter by search (name or email)
      if (
        filters.search &&
        !(
          seller.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          seller.email.toLowerCase().includes(filters.search.toLowerCase())
        )
      )
        return false;
      // Filter by dateRange
      if (filters.dateRange !== "all") {
        const joinDate = new Date(seller.joinDate);
        const now = new Date();
        if (
          filters.dateRange === "7days" &&
          (now - joinDate) / (1000 * 60 * 60 * 24) > 7
        )
          return false;
        if (
          filters.dateRange === "30days" &&
          (now - joinDate) / (1000 * 60 * 60 * 24) > 30
        )
          return false;
      }
      return true;
    });
  }, [users, filters]);

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
      render: (value) => `$${(value || 0).toLocaleString()}`,
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
        data={filteredSellers}
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
