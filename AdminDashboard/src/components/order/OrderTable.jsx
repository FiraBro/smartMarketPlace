// src/components/orders/OrderTable.jsx
import React from "react";
import DataTable from "../common/DataTable";
import StatusBadge from "../common/StatusBadge";

export default function OrderTable() {
  const orders = [
    {
      id: "ORD-001",
      customer: "Alice Johnson",
      seller: "Tech Gadgets Inc.",
      amount: 299.97,
      status: "shipped",
      orderDate: "2024-03-01",
      items: 3,
    },
    {
      id: "ORD-002",
      customer: "Bob Smith",
      seller: "Fashion Store",
      amount: 159.99,
      status: "pending",
      orderDate: "2024-03-02",
      items: 2,
    },
  ];

  const columns = [
    { key: "id", title: "Order ID" },
    { key: "customer", title: "Customer" },
    { key: "seller", title: "Seller" },
    { key: "amount", title: "Amount", render: (value) => `$${value}` },
    {
      key: "status",
      title: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    { key: "orderDate", title: "Order Date" },
    { key: "items", title: "Items" },
  ];

  const actions = (order) => (
    <div className="flex space-x-2">
      <button className="text-blue-600 hover:text-blue-900 text-sm">
        View
      </button>
      <button className="text-green-600 hover:text-green-900 text-sm">
        Update
      </button>
    </div>
  );

  return <DataTable columns={columns} data={orders} actions={actions} />;
}
