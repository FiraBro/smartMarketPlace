// src/components/orders/OrderTable.jsx
import React from "react";
import DataTable from "../common/DataTable";
import StatusBadge from "../common/StatusBadge";

export default function OrderTable({ orders = [] }) {
  const columns = [
    { key: "orderId", title: "Order ID" },
    { key: "sellerName", title: "Seller" },

    {
      key: "orderStatus",
      title: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: "items",
      title: "Items",
      render: (items) => items?.length || 0,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-150px)]">
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No orders available.</p>
      ) : (
        <DataTable columns={columns} data={orders} />
      )}
    </div>
  );
}
