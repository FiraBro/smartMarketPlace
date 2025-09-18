// service/newsletterService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const subscribeNewsletter = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/api/newsletter/subscribe`, {
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    throw error.response?.data || { message: "Subscription failed" };
  }
};
