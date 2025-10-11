import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaHome, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/SideBar";
import ProfileTab from "../components/ProfileTab";
import OrderTab from "../components/OrderTab";
import AddressesTab from "../components/AddressTab";
import SettingsTab from "../components/SettingTab";
import NotificationTab from "../components/NotificationTab";
import { getOrders } from "../service/orderService";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../service/addressService";

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    joinDate: "",
    favorites: [],
  });
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch user info
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

  // Fetch orders and addresses
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

  // Address handlers
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-white shadow px-4 py-3 sticky top-0 z-50">
        {/* Center: My Account */}
        <div className="flex-1 text-center">
          <h1 className="text-xl font-semibold text-gray-800">My Account</h1>
        </div>

        {/* Right: Home + Logout */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition"
          >
            <FaHome />
            <span className="hidden sm:inline font-medium">Home</span>
          </Link>

          <button
            onClick={logout}
            className="flex items-center gap-1 text-gray-700 hover:text-red-600 transition"
          >
            <FaSignOutAlt />
            <span className="hidden sm:inline font-medium">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <Sidebar
          userData={{ ...userData, orders, addresses }}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        {/* Tabs */}
        <div className="flex-1 lg:w-3/4">
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
          {activeTab === "settings" && <SettingsTab logout={logout} />}
          {activeTab === "notifications" && <NotificationTab />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
