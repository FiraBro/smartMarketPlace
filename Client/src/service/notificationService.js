// src/services/notificationUserApi.js
import axios from "axios";

// -------------------------
// Axios instance for notification API
// -------------------------
const API = axios.create({
  baseURL: import.meta.env.VITE_NOTIFICATION_URL || "http://localhost:5000/api/notifications",
  withCredentials: true,
});

// -------------------------
// Fetch paginated notifications for the logged-in user
// -------------------------
export const fetchNotifications = async (page = 1, limit = 10) => {
  try {
    const response = await API.get("/user", { params: { page, limit } });
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error.response?.data || error.message);
    throw error;
  }
};

// -------------------------
// Mark a single notification as read
// -------------------------
export const markAsRead = async (id) => {
  try {
    const response = await API.patch(`/${id}/read`);
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error.response?.data || error.message);
    throw error;
  }
};

// -------------------------
// Mark all notifications as read
// -------------------------
export const markAllAsRead = async () => {
  try {
    const response = await API.patch("/read-all");
    return response.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error.response?.data || error.message);
    throw error;
  }
};
