import axios from "axios";

// API base
const API = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL || "http://localhost:5000/api/auth",
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ======================
// 🔹 EMAIL/PASSWORD AUTH
// ======================
export const loginUser = async (credentials) => {
  const { data } = await API.post("/login", credentials);
  if (data.token) localStorage.setItem("token", data.token);
  return data; // { user, token }
};

export const registerUser = async (info) => {
  const { data } = await API.post("/register", info);
  if (data.token) localStorage.setItem("token", data.token);
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

export const getCurrentUser = async () => {
  const { data } = await API.get("/me");
  return data.user;
};

export const updateProfile = async (updates) => {
  const { data } = await API.put("/me", updates);
  return data.user;
};

// ======================
// 🌍 OAUTH INTEGRATION
// ======================

// GitHub login
export const continueWithGithub = () => {
  window.location.href = "http://localhost:5000/api/auth/github";
};

// Handle OAuth callback (optional)
// This will run when user comes back to frontend with ?token=...
export const handleOAuthCallback = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (token) {
    localStorage.setItem("token", token);
    window.location.href = "/"; // redirect home or dashboard
  }
};
