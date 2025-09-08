// services/bannerService.js
import axios from "axios";

// Base API instance
const BANNER_API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token if available
BANNER_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔹 Fetch all banners
export const getBanners = async () => {
  const { data } = await BANNER_API.get("/banners");
  return data.data.banners; // expecting { status, data: { banners: [...] } }
};

// 🔹 Upload new banner
export const uploadBanner = async (file) => {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("image", file);

  const { data } = await BANNER_API.post("/banners", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.data.banner; // { _id, image, createdAt }
};

// 🔹 Delete a specific banner
export const deleteBanner = async (bannerId) => {
  if (!bannerId) throw new Error("Banner ID required");

  const { data } = await BANNER_API.delete(`/banners/${bannerId}`);
  return data; // { status: "success", message: "Banner deleted" }
};
