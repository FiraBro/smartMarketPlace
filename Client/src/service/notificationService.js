// src/services/notificationUserApi.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/notifications",
  withCredentials: true, // ✅ include cookies/session for auth
});

// ---------------------
// Fetch all notifications for logged-in user
// ---------------------
export const fetchNotifications = async () => {
  const { data } = await API.get("/");
  console.log("Fetched notifications:", data);
  return data.notifications; // returns array of notifications
};

// ---------------------
// Mark all notifications as read
// ---------------------
export const markAllAsRead = async () => {
  const { data } = await API.patch("/read-all"); // endpoint in backend
  return data.notifications; // returns updated notifications
};

// ---------------------
// Mark a single notification as read
// ---------------------
export const markAsRead = async (id) => {
  const { data } = await API.patch(`/read/${id}`);
  return data.notification; // updated single notification
};
