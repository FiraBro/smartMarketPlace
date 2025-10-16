import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/notifications";

// Configure Axios to send cookies with every request
axios.defaults.withCredentials = true;

// ============================= ADMIN SERVICES ============================= //

// Send a new notification (admin only)
export const sendNotification = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/admin`, data);
  return res.data;
};

// Get all notification history (admin only)
export const getNotificationHistory = async () => {
  const res = await axios.get(`${API_BASE_URL}/admin`);
  return res.data.notifications;
};

// Get single notification by ID (admin only)
export const getNotificationById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/admin/${id}`);
  return res.data.notification;
};

// Delete notification by ID (admin only)
export const deleteNotification = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/admin/${id}`);
  return res.data;
};

// ============================== USER SERVICES ============================== //

// Get notifications for the logged-in user
export const getUserNotifications = async () => {
  const res = await axios.get(API_BASE_URL);
  return res.data.notifications;
};

// Mark a specific notification as read
export const markAsRead = async (id) => {
  const res = await axios.patch(`${API_BASE_URL}/read/${id}`);
  return res.data;
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  const res = await axios.patch(`${API_BASE_URL}/read-all`);
  return res.data;
};
