import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getOrders } from "../service/orderService";
import { getAddresses } from "../service/addressService";
import OrderTab from "../components/OrderTab";
import ProfileTab from "../components/ProfileTab";
import AddressesTab from "../components/AddressTab";
import NotificationTab from "../components/NotificationTab";
import SettingsTab from "../components/SettingTab";
import Sidebar from "../components/SideBar";
import { FaBars, FaHome, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

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
  });
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <Sidebar
          userData={userData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          orders={orders}
          addresses={addresses}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        {/* Main Tabs */}
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
          {activeTab === "addresses" && <AddressesTab addresses={addresses} />}
          {activeTab === "settings" && <SettingsTab logout={logout} />}
          {activeTab === "notifications" && <NotificationTab />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
