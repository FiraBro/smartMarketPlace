import axios from "axios";

// API base
const API = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL || "http://localhost:5000/api/v1/auth",
  withCredentials: true, // ✅ important for sending session cookies
});

// ======================
// 🔹 EMAIL/PASSWORD AUTH
// ======================

export const loginUser = async (credentials) => {
  const { data } = await API.post("/login", credentials);
  return data; // { user }
};

export const registerUser = async (info) => {
  const { data } = await API.post("/register", info);
  return data; // { user }
};

export const logoutUser = async () => {
  await API.post("/logout"); // optional endpoint to destroy session on server
};

export const getCurrentUser = async () => {
  const { data } = await API.get("/me");
  return data.user;
};

export const updateProfile = async (updates) => {
  const { data } = await API.put("/me", updates);
  return data.user;
};
export const checkAuthStatus = async () => {
  const { data } = await API.get("/check");
  return data; // { loggedIn: boolean, user? }
};
