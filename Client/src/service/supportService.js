// src/services/supportService.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_SUPPORT_URL || "http://localhost:5000/api/support",
  withCredentials: true, // include cookies/session
});

export const sendSupportMessage = async (formData) => {
  try {
    const res = await API.post("/contact", formData); // ✅ use post
    return res.data; // ✅ Axios response data
  } catch (error) {
    // Optional: extract error message from server
    const message =
      error.response?.data?.message || "Network error. Please try again.";
    throw new Error(message);
  }
};
