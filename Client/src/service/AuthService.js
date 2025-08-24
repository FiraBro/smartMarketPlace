import axios from "axios";

// API base
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth",
});

// Helper: attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // store token in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// LOGIN
export const loginUser = async (credentials) => {
  const { data } = await API.post("/login", credentials);
  if (data.token) {
    localStorage.setItem("token", data.token); // save token for later requests
  }
  return data; // { user, token }
};

// REGISTER
export const registerUser = async (info) => {
  const { data } = await API.post("/register", info);
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
};

// LOGOUT
export const logoutUser = () => {
  localStorage.removeItem("token"); // just remove token
};

// GET CURRENT USER
export const getCurrentUser = async () => {
  const { data } = await API.get("/me");
  return data.user;
};
