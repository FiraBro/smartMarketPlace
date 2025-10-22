// src/pages/Dashboard.jsx
import React from "react";
import { motion } from "framer-motion";
import MetricCard from "../components/dashboard/MetricCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import SalesChart from "../components/dashboard/SalesChart";
import QuickStats from "../components/dashboard/QuickStats";

export default function Dashboard() {
  console.log('yes')
  const metrics = [
    {
      title: "Gross Merchandise Volume",
      value: "$1.2M",
      change: "+12.5%",
      trend: "up",
      icon: "💰",
    },
    {
      title: "Total Orders",
      value: "8,542",
      change: "+8.2%",
      trend: "up",
      icon: "📦",
    },
    {
      title: "Platform Revenue",
      value: "$84,200",
      change: "+15.3%",
      trend: "up",
      icon: "💸",
    },
    {
      title: "Active Users",
      value: "23,847",
      change: "+5.7%",
      trend: "up",
      icon: "👥",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MetricCard {...metric} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <SalesChart />
        </div>

        {/* Quick Stats & Recent Activity */}
        <div className="space-y-6">
          <QuickStats />
          <RecentActivity />
        </div>
      </div>
    </motion.div>
  );
}
