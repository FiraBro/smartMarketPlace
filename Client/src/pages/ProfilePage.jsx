import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

import ProfileTab from "../components/ProfileTab";
import OrderTab from "../components/OrderTab";
import AddressesTab from "../components/AddressTab";
import SettingsTab from "../components/SettingTab";
import NotificationTabs from "../components/NotificationTab";
import NotificationCard from "../components/NotificationCard";
import NotificationSkeleton from "../components/NotificationSkeleton";
import EmptyState from "../components/EmptyState";

import { getMyOrders } from "../service/orderService";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../service/addressService";

import { fetchNotifications, markAsRead } from "../service/notificationService";

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

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [activeNotificationTab, setActiveNotificationTab] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Refs for scrolling tabs
  const tabContainerRef = useRef(null);
  const tabRefs = useRef([]);

  // Load user info
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

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

  // Scroll tabs
  const handleTabClick = (index, id) => {
    setActiveTab(id);
    tabRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
    });
  };

  useEffect(() => {
    const activeIndex = tabs.findIndex((t) => t.id === activeTab);
    tabRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
    });
  }, []);

  // ------------------- Notification logic -------------------

  const notificationCounts = {
    all: notifications.length,
    info: notifications.filter((n) => n.type === "info").length,
    alert: notifications.filter((n) => n.type === "alert").length,
    reminder: notifications.filter((n) => n.type === "reminder").length,
    order: notifications.filter((n) => n.type === "order").length,
    payment: notifications.filter((n) => n.type === "payment").length,
  };

  const unreadCounts = {
    all: notifications.filter((n) => !n.read).length,
    info: notifications.filter((n) => n.type === "info" && !n.read).length,
    alert: notifications.filter((n) => n.type === "alert" && !n.read).length,
    reminder: notifications.filter((n) => n.type === "reminder" && !n.read)
      .length,
    order: notifications.filter((n) => n.type === "order" && !n.read).length,
    payment: notifications.filter((n) => n.type === "payment" && !n.read)
      .length,
  };

  const loadNotifications = useCallback(
    async (pageNum = 1, shouldAppend = false) => {
      try {
        setLoading(true);
        const data = await fetchNotifications(pageNum, 15);

        if (shouldAppend) {
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n._id));
            const newNotifications = data.notifications.filter(
              (n) => !existingIds.has(n._id)
            );
            return [...prev, ...newNotifications];
          });
        } else {
          setNotifications(data.notifications);
        }

        setHasMore(data.notifications.length === 15);
      } catch (err) {
        console.error("Failed to load notifications:", err);
        toast.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Only load notifications when Notifications tab is active
  useEffect(() => {
    if (activeTab === "notifications") {
      loadNotifications(1, false);
      setPage(1);
    }
  }, [activeTab, loadNotifications]);

  const filteredNotifications = notifications.filter((n) =>
    activeNotificationTab === "all" ? true : n.type === activeNotificationTab
  );

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadNotifications(nextPage, true);
  };

  // -------------------------------------------------------------

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
        {activeTab === "notifications" && (
          <div>
            <NotificationTabs
              activeTab={activeNotificationTab}
              setActiveTab={setActiveNotificationTab}
              counts={notificationCounts}
              unreadCounts={unreadCounts}
              role={user.role}
            />

            <div className="rounded-2xl shadow-sm border-none overflow-hidden mt-4">
              {loading && notifications.length === 0 ? (
                <div className="divide-y divide-gray-100">
                  {[...Array(5)].map((_, index) => (
                    <NotificationSkeleton key={index} />
                  ))}
                </div>
              ) : filteredNotifications.length === 0 ? (
                <EmptyState type={activeNotificationTab} />
              ) : (
                filteredNotifications.map((n) => (
                  <NotificationCard
                    key={n._id}
                    notification={n}
                    onMarkAsRead={async (id) => {
                      try {
                        await markAsRead(id);
                        setNotifications((prev) =>
                          prev.map((notif) =>
                            notif._id === id ? { ...notif, read: true } : notif
                          )
                        );
                        toast.success("Marked as read!");
                      } catch {
                        toast.error("Failed to mark as read");
                      }
                    }}
                  />
                ))
              )}

              {hasMore && !loading && (
                <div className="p-6 text-center border-t border-gray-100">
                  <button
                    onClick={loadMore}
                    className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg font-medium hover:from-orange-500 hover:to-orange-600 transition-all cursor-pointer duration-200 shadow-sm"
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
