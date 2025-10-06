import axios from "axios";

const VERIFY_API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

VERIFY_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Match backend pattern — field FIRST
export const sendVerificationCode = (field) =>
  VERIFY_API.post(`/verify/${field}/send`);

export const verifyCode = (field, code) =>
  VERIFY_API.post(`/verify/${field}/verify`, { code });
