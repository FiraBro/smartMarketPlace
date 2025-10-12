import React, { useEffect, useMemo, useState } from "react";
import {
  FaUser,
  FaShoppingBag,
  FaHeart,
  FaBell,
  FaMapMarkerAlt,
  FaCog,
  FaBars,
} from "react-icons/fa";
import { getOrders } from "../service/orderService";
import { getAddresses } from "../service/addressService";

const Sidebar = ({ userData, activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [overview, setOverview] = useState({
    orders: 0,
    addresses: 0,
    favorites: 0,
  });

  const tabs = useMemo(
    () => [
      { id: "profile", name: "Profile", icon: FaUser },
      { id: "orders", name: "Orders", icon: FaShoppingBag },
      { id: "addresses", name: "Addresses", icon: FaMapMarkerAlt },
      { id: "settings", name: "Settings", icon: FaCog },
      { id: "notifications", name: "Notifications", icon: FaBell },
    ],
    []
  );

  // Fetch account overview
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const [ordersRes, addressesRes] = await Promise.all([
          getOrders(),
          getAddresses(),
        ]);

        setOverview({
          orders: ordersRes?.length || 0,
          addresses: addressesRes?.length || 0,
          favorites: userData?.favorites?.length || 0,
        });
      } catch (error) {
        console.error("Failed to fetch account overview:", error);
      }
    };

    fetchOverview();
  }, [userData]);

  return (
    <>
      {/* ✅ Mobile Hamburger Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-none text-gray-900 lg:hidden shadow"
        onClick={() => setIsOpen(true)}
      >
        <FaBars className="text-xl" />
      </button>

      {/* Overlay (for mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button (Mobile Only) */}
        <div className="flex justify-end p-4 lg:hidden">
          <button
            className="px-2 py-1 text-gray-700 hover:text-red-500 text-2xl"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-4 p-6 border-b border-gray-100">
          <img
            className="h-16 w-16 rounded-full object-cover border-2 border-yellow-500"
            src={userData.avatar}
            alt="Profile"
          />
          <div>
            <h2 className="font-semibold text-gray-900">{userData.name}</h2>
            <p className="text-sm text-gray-500">{userData.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <nav className="space-y-2 px-6 mt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-gray-100 text-yellow-800 border cursor-pointer border-gray-50"
                    : "text-gray-700 cursor-pointer hover:bg-gray-50"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Account Overview */}
        <div className="p-6 mt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Account Overview
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-yellow-50 rounded-xl p-3 text-center">
              <FaShoppingBag className="mx-auto text-yellow-600 text-lg" />
              <h3 className="text-lg font-semibold text-gray-800">
                {overview.orders}
              </h3>
              <p className="text-sm text-gray-500">Orders</p>
            </div>

            <div className="bg-yellow-50 rounded-xl p-3 text-center">
              <FaMapMarkerAlt className="mx-auto text-yellow-600 text-lg" />
              <h3 className="text-lg font-semibold text-gray-800">
                {overview.addresses}
              </h3>
              <p className="text-sm text-gray-500">Addresses</p>
            </div>

            <div className="bg-yellow-50 rounded-xl p-3 text-center">
              <FaHeart className="mx-auto text-yellow-600 text-lg" />
              <h3 className="text-lg font-semibold text-gray-800">
                {overview.favorites}
              </h3>
              <p className="text-sm text-gray-500">Favorites</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
