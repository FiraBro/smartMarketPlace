import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

import ProfileTab from "../components/ProfileTab";
import OrderTab from "../components/OrderTab";
import AddressesTab from "../components/AddressTab";
import SettingsTab from "../components/SettingTab";
import NotificationTabs from "../components/NotificationTab";
import { getMyOrders } from "../service/orderService";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../service/addressService";

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "orders", label: "Orders" },
  { id: "addresses", label: "Addresses" },
  { id: "settings", label: "Settings" },
  { id: "notifications", label: "Notifications" },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState({});
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Refs for scrolling tabs
  const tabContainerRef = useRef(null);
  const tabRefs = useRef([]);

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar:
          user.avatar ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        joinDate: user.joinDate || "",
        favorites: user.favorites || [],
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersRes, addressesRes] = await Promise.all([
          getMyOrders(),
          getAddresses(),
        ]);
        setOrders(ordersRes);
        setAddresses(addressesRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAdd = async (addressData) => {
    try {
      const created = await createAddress(addressData);
      setAddresses((prev) => [...prev, created]);
    } catch (err) {
      console.error("Failed to add address:", err);
    }
  };

  const handleEdit = async (addressData) => {
    try {
      const updated = await updateAddress(addressData._id, addressData);
      setAddresses((prev) =>
        prev.map((a) => (a._id === updated._id ? updated : a))
      );
    } catch (err) {
      console.error("Failed to update address:", err);
    }
  };

  const handleDelete = async (addr) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;
    try {
      await deleteAddress(addr._id);
      setAddresses((prev) => prev.filter((a) => a._id !== addr._id));
    } catch (err) {
      console.error("Failed to delete address:", err);
    }
  };

  const handleSetDefault = async (addr) => {
    try {
      const updated = await updateAddress(addr._id, {
        ...addr,
        isDefault: true,
      });
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a._id === updated._id }))
      );
    } catch (err) {
      console.error("Failed to set default address:", err);
    }
  };

  // Scroll clicked tab into center
  const handleTabClick = (index, id) => {
    setActiveTab(id);
    tabRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
    });
  };

  // Center active tab on mount
  useEffect(() => {
    const activeIndex = tabs.findIndex((t) => t.id === activeTab);
    tabRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center gap-6">
          <img
            src={userData.avatar}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border border-[#f9A03f]/50"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-800">
              {userData.name}
            </h2>
            <p className="text-gray-500 text-sm">
              Member since {userData.joinDate}
            </p>
            <div className="mt-2 flex gap-3 text-sm">
              <Link
                to="/"
                className="flex items-center gap-1 text-[#f9A03f] hover:underline"
              >
                <FaHome /> Home
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-600 hover:text-red-500"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white border-b border-gray-100 relative">
        <div
          ref={tabContainerRef}
          className="max-w-6xl mx-auto px-4 flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar py-3"
        >
          {tabs.map((t, idx) => (
            <button
              key={t.id}
              ref={(el) => (tabRefs.current[idx] = el)}
              className={`flex-shrink-0 snap-center px-4 py-2 rounded-bl-xl text-sm font-medium relative transition ${
                activeTab === t.id
                  ? "text-white bg-[#f9A03f]"
                  : "text-gray-700 bg-gray-50 hover:bg-gray-100"
              }`}
              onClick={() => handleTabClick(idx, t.id)}
            >
              {t.label}

              {/* Animated underline for active tab */}
              {activeTab === t.id && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-white rounded-full animate-slideIn"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === "profile" && (
          <ProfileTab
            userData={userData}
            setUserData={setUserData}
            updateUser={updateUser}
          />
        )}
        {activeTab === "orders" && (
          <OrderTab orders={orders} loading={loading} />
        )}
        {activeTab === "addresses" && (
          <AddressesTab
            addresses={addresses}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSetDefault={handleSetDefault}
          />
        )}
        {activeTab === "settings" && <SettingsTab logout={handleLogout} />}
        {activeTab === "notifications" && <NotificationTabs />}
      </div>
    </div>
  );
};

export default ProfilePage;
