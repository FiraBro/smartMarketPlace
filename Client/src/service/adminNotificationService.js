import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_ADMIN_URL || "http://localhost:5000/api/v1/admin";

// Configure Axios to send cookies with every request
axios.defaults.withCredentials = true;

// ============================= ADMIN SERVICES ============================= //

// Send a new notification (admin only)
export const sendNotification = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/notifications`, data);
  return res.data;
};

// Get all notification history (admin only)
export const getNotificationHistory = async (filters = {}) => {
  // Build query string from filters
  const queryString = new URLSearchParams(filters).toString(); // channel=email&status=sent
  const url = `${API_BASE_URL}/notifications/${
    queryString ? `?${queryString}` : ""
  }`;

  const res = await axios.get(url);
  return res.data.notifications;
};

// Get single notification by ID (admin only)
export const getNotificationById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/${id}`);
  return res.data.notification;
};

// Delete notification by ID (admin only)
export const deleteNotification = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/notifications/${id}`);
  console.log(res);

  return res.data;
};
// ============================== USER SERVICES ============================== //

// Fetch notifications for logged-in user with pagination
export const fetchNotifications = async (page = 1, limit = 10) => {
  const res = await axios.get(`${API_BASE_URL}/user`, {
    params: { page, limit },
  });
  return res.data; // includes notifications + pagination
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
