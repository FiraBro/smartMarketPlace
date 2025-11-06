import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

import ProfileTab from "../components/ProfileTab";
import OrderTab from "../components/OrderTab";
import AddressesTab from "../components/AddressTab";
import SettingsTab from "../components/SettingTab";
import NotificationTabs from "../components/NotificationTab";

import { getOrders } from "../service/orderService";
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
          getOrders(),
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
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddress(addr._id);
      setAddresses((prev) => prev.filter((a) => a._id !== addr._id));
    } catch (err) {
      console.error("Failed to delete address:", err);
    }
  };

  const handleSetDefault = async (addr) => {
    try {
      const updated = await updateAddress(addr._id, { ...addr, isDefault: true });
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a._id === updated._id }))
      );
    } catch (err) {
      console.error("Failed to set default address:", err);
    }
  };

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
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 flex gap-3 overflow-x-auto py-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`px-4 py-2 rounded-bl-xl text-sm font-medium transition
                ${
                  activeTab === t.id
                    ? "bg-[#f9A03f] text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
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
