import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getOrders } from "../service/orderService";
import { getAddresses } from "../service/addressService";
import ProfileTab from "./ProfileTab";
import OrdersTab from "./OrderTab";
import AddressesTab from "./AddressTab";
import SettingsTab from "./SettingTab";
import Sidebar from "./SideBar";
import NotificationsTab from "./NotificationTab";

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

  // Sync userData with user from context
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">
            Manage your profile, orders, and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar
            userData={userData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            orders={orders}
            addresses={addresses}
          />

          <div className="lg:w-3/4">
            {activeTab === "profile" && (
              <ProfileTab
                userData={userData}
                setUserData={setUserData}
                updateUser={updateUser}
              />
            )}
            {activeTab === "orders" && (
              <OrdersTab orders={orders} loading={loading} />
            )}
            {activeTab === "addresses" && (
              <AddressesTab addresses={addresses} />
            )}
            {activeTab === "settings" && <SettingsTab logout={logout} />}
            {activeTab === "notifications" && <NotificationsTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
