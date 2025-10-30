import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext"; // ✅ Import your AuthContext hook

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within a SocketProvider");
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user } = useAuth(); // ✅ Get user from AuthContext
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user?._id) return; // Wait for user to be available

    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
    const newSocket = io(socketUrl, {
      query: { userId: user._id },
      transports: ["websocket", "polling"],
    });

    setSocket(newSocket);

    // ✅ Connection events
    newSocket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("⚠️ Socket connection error:", error);
      setIsConnected(false);
    });

    // ✅ Notification events
    newSocket.on("new_notification", (notification) => {
      console.log("📩 New notification received:", notification);
      setNotifications((prev) => [notification, ...prev]);

      toast.info(notification.message, {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        draggable: true,
        theme: "light",
      });
    });

    newSocket.on("notification_read", ({ notificationId }) => {
      console.log("🔖 Notification marked as read:", notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
    });

    newSocket.on("all_notifications_read", () => {
      console.log("✅ All notifications marked as read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    });

    // ✅ Cleanup on unmount or logout
    return () => {
      console.log("🔌 Closing socket connection...");
      newSocket.close();
      setSocket(null);
      setIsConnected(false);
      setNotifications([]);
    };
  }, [user?._id]);

  const value = {
    socket,
    isConnected,
    notifications,
    setNotifications,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
