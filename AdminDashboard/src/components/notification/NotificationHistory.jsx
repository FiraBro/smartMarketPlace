import React, { useState, useEffect } from "react";
import DataTable from "../common/DataTable";
import StatusBadge from "../common/StatusBadge";
import CustomSelect from "../common/CustomSelect";
import {
  EnvelopeIcon,
  BellIcon,
  EyeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useAdminNotifications } from "../../hooks/useAdminNotification";

export default function NotificationHistory({ notificationsHook }) {
  const { notifications, fetchHistory, loading, error } = notificationsHook;

  // filters, etc.
  const [filters, setFilters] = useState({
    channel: "all",
    status: "all",
    dateRange: "30days",
  });
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <CustomSelect
            label="Channel"
            value={filters.channel}
            onChange={(v) => setFilters({ ...filters, channel: v })}
            options={[
              { value: "all", label: "All Channels" },
              { value: "in_app", label: "In-App" },
              { value: "email", label: "Email" },
            ]}
          />
          <CustomSelect
            label="Status"
            value={filters.status}
            onChange={(v) => setFilters({ ...filters, status: v })}
            options={[
              { value: "all", label: "All Status" },
              { value: "sent", label: "Sent" },
              { value: "scheduled", label: "Scheduled" },
              { value: "failed", label: "Failed" },
            ]}
          />
          <CustomSelect
            label="Date Range"
            value={filters.dateRange}
            onChange={(v) => setFilters({ ...filters, dateRange: v })}
            options={[
              { value: "today", label: "Today" },
              { value: "7days", label: "Last 7 Days" },
              { value: "30days", label: "Last 30 Days" },
              { value: "90days", label: "Last 90 Days" },
            ]}
          />
          <div className="flex items-end">
            <button
              onClick={() => fetchHistory(filters)}
              className="w-full bg-[#f9a03f] text-white px-4 py-2 rounded-md hover:bg-[#faa64d] transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && (
        <DataTable columns={columns} data={notifications} actions={actions} />
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
