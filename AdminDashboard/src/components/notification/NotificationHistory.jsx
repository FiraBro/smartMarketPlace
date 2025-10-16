import React, { useState, useEffect } from "react";
import DataTable from "../common/DataTable";
import StatusBadge from "../common/StatusBadge";
import { useAdminNotifications } from "../../hooks/useAdminNotification";
import {
  EnvelopeIcon,
  BellIcon,
  EyeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function NotificationHistory() {
  const { notifications, fetchHistory, loading, error } =
    useAdminNotifications();

  const [filters, setFilters] = useState({
    channel: "all",
    status: "all",
    dateRange: "7days",
  });

  // Fetch history whenever filters change
  useEffect(() => {
    fetchHistory(filters);
  }, [filters.channel, filters.status, filters.dateRange]);

  const getChannelIcon = (channel) => {
    switch (channel) {
      case "email":
        return <EnvelopeIcon className="h-4 w-4 text-blue-500" />;
      case "in_app":
        return <BellIcon className="h-4 w-4 text-green-500" />;
      case "both":
        return (
          <div className="flex space-x-1">
            <BellIcon className="h-3 w-3 text-green-500" />
            <EnvelopeIcon className="h-3 w-3 text-blue-500" />
          </div>
        );
      default:
        return <BellIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const columns = [
    {
      key: "channel",
      title: "Channel",
      render: (value) => (
        <div className="flex items-center space-x-2">
          {getChannelIcon(value)}
          <span className="capitalize">{value.replace("_", " ")}</span>
        </div>
      ),
    },
    { key: "subject", title: "Subject" },
    {
      key: "recipientType",
      title: "Recipients",
      render: (value) => <span className="capitalize">{value}</span>,
    },
    {
      key: "createdAt",
      title: "Sent At",
      render: (value) =>
        value ? new Date(value).toLocaleString() : "Scheduled",
    },
    {
      key: "status",
      title: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const actions = (notification) => (
    <div className="flex space-x-2">
      <button
        className="text-blue-600 hover:text-blue-900 p-1 rounded"
        title="View Details"
      >
        <EyeIcon className="h-4 w-4" />
      </button>
      <button
        className="text-green-600 hover:text-green-900 p-1 rounded"
        title="View Analytics"
      >
        <ChartBarIcon className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Channel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Channel
            </label>
            <select
              value={filters.channel}
              onChange={(e) =>
                setFilters({ ...filters, channel: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Channels</option>
              <option value="in-app">In-App</option>
              <option value="email">Email</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="scheduled">Scheduled</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) =>
                setFilters({ ...filters, dateRange: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>

          {/* Refresh Button */}
          <div className="flex items-end">
            <button
              onClick={() => fetchHistory(filters)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <DataTable
          keyField="_id"
          columns={columns}
          data={notifications || []}
          actions={actions}
        />
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}
    </div>
  );
}
