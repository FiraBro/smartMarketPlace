import React from "react";
import DataTable from "../common/DataTable";
import StatusBadge from "../common/StatusBadge";

export default function ProductTable({ products = [] }) {
  const columns = [
    { key: "productTitle", title: "Product Name" },
    { key: "sellerName", title: "Seller" },
    { key: "category", title: "Category" },
    { key: "stock", title: "Stock" },
    {
      key: "sellerStatus",
      title: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const actions = (product) => (
    <div className="flex justify-center space-x-2">
      <button className="text-red-600 hover:text-red-900 text-sm">
        Delete
      </button>
    </div>
  );

  return (
    <DataTable columns={columns} data={products || []} actions={actions} />
  );
}
