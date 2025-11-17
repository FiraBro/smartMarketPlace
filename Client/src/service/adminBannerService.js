// services/bannerService.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export const getBannersService = () => api.get("/banners");

export const uploadBannerService = (formData) =>
  api.post("/banners", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
