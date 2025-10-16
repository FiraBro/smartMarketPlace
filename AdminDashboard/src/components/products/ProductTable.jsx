// src/components/products/ProductTable.jsx
import React, { useState } from "react";
import DataTable from "../common/DataTable";
import StatusBadge from "../common/StatusBadge";

export default function ProductTable() {
  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      seller: "Tech Gadgets Inc.",
      category: "Electronics",
      price: 99.99,
      stock: 45,
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Running Shoes",
      seller: "Sports Gear Co.",
      category: "Sports",
      price: 129.99,
      stock: 0,
      status: "inactive",
      createdAt: "2024-02-01",
    },
  ];

  const columns = [
    { key: "name", title: "Product Name" },
    { key: "seller", title: "Seller" },
    { key: "category", title: "Category" },
    { key: "price", title: "Price", render: (value) => `$${value}` },
    { key: "stock", title: "Stock" },
    {
      key: "status",
      title: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const actions = (product) => (
    <div className="flex space-x-2">
      <button className="text-blue-600 hover:text-blue-900 text-sm">
        Edit
      </button>
      <button className="text-green-600 hover:text-green-900 text-sm">
        Feature
      </button>
      <button className="text-red-600 hover:text-red-900 text-sm">
        Delete
      </button>
    </div>
  );

  return <DataTable columns={columns} data={products} actions={actions} />;
}
