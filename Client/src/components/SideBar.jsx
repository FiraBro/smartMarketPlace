import React, { useMemo } from "react";
import {
  FaUser,
  FaShoppingBag,
  FaHeart,
  FaMapMarkerAlt,
  FaCog,
} from "react-icons/fa";

const Sidebar = ({ userData, activeTab, setActiveTab, orders, addresses }) => {
  const tabs = useMemo(
    () => [
      { id: "profile", name: "Profile", icon: FaUser },
      { id: "orders", name: "Orders", icon: FaShoppingBag },
      { id: "addresses", name: "Addresses", icon: FaMapMarkerAlt },
      { id: "settings", name: "Settings", icon: FaCog },
    ],
    []
  );

  const stats = useMemo(
    () => [
      {
        label: "Total Orders",
        value: orders.length.toString(),
        icon: FaShoppingBag,
        color: "blue",
      },
      {
        label: "Wishlist Items",
        value: userData?.favorites?.length?.toString() || "0",
        icon: FaHeart,
        color: "pink",
      },
      {
        label: "Saved Addresses",
        value: addresses.length.toString(),
        icon: FaMapMarkerAlt,
        color: "green",
      },
    ],
    [orders.length, addresses.length, userData?.favorites?.length]
  );

  return (
    <div className="lg:w-1/4">
      {/* User Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <img
            className="h-16 w-16 rounded-full object-cover border-2 border-primary-500"
            src={userData.avatar}
            alt="Profile"
          />
          <div>
            <h2 className="font-semibold text-gray-900">{userData.name}</h2>
            <p className="text-sm text-gray-500">{userData.email}</p>
          </div>
        </div>

        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary-50 text-primary-700 border border-primary-200"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Account Overview</h3>
        <div className="space-y-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                    <Icon className={`h-4 w-4 text-${stat.color}-600`} />
                  </div>
                  <span className="text-sm text-gray-600">{stat.label}</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {stat.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
