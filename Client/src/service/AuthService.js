// import axios from "axios";

// // API base
// const API = axios.create({
//   baseURL: import.meta.env.VITE_AUTH_URL || "http://localhost:5000/api/v1/auth",
//   withCredentials: true, // ✅ important for sending session cookies
// });

// // ======================
// // 🔹 EMAIL/PASSWORD AUTH
// // ======================

// export const loginUser = async (credentials) => {
//   const { data } = await API.post("/login", credentials);
//   return data; // { user }
// };

// export const registerUser = async (info) => {
//   const { data } = await API.post("/register", info);
//   return data; // { user }
// };

// export const logoutUser = async () => {
//   await API.post("/logout"); // optional endpoint to destroy session on server
// };

// export const getCurrentUser = async () => {
//   const { data } = await API.get("/me");
//   return data.user;
// };

// export const updateProfile = async (updates) => {
//   const { data } = await API.put("/me", updates);
//   return data.user;
// };
// export const checkAuthStatus = async () => {
//   const { data } = await API.get("/check");
//   return data; // { loggedIn: boolean, user? }
// };

import axios from "axios";

// -----------------------------
// API instance with baseURL
// -----------------------------
const API = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL || "http://localhost:5000/api/v1/auth",
  withCredentials: true, // important to send session cookies
});

// -----------------------------
// 🔹 REGISTER
// role: "admin" | "seller" | "buyer"
export const register = async (info) => {
  // info should include: name, email, password, role, phone
  const { data } = await API.post("/register", info);
  return data; // { user }
};

// -----------------------------
// 🔹 LOGIN
// -----------------------------
export const login = async (credentials) => {
  // credentials: { email, password }
  const { data } = await API.post("/login", credentials);
  console.log("Login successful: ", data);
  return data; // { user }
};

// -----------------------------
// 🔹 LOGOUT
// -----------------------------
export const logout = async () => {
  const { data } = await API.post("/logout");
  return data;
};

// -----------------------------
// 🔹 GET CURRENT LOGGED-IN USER
// -----------------------------
export const getCurrentUser = async () => {
  const { data } = await API.get("/me");
  console.log("getCurrentUser response data:", data);
  return data.user; // { id, name, email, role, avatar }
};

// -----------------------------
// 🔹 UPDATE PROFILE
// -----------------------------
export const updateProfile = async (updates) => {
  const { data } = await API.put("/me", updates);
  return data.user; // updated user info
};

// -----------------------------
// 🔹 CHECK AUTH STATUS
// -----------------------------
export const checkAuthStatus = async () => {
  const { data } = await API.get("/check");
  return data; // { loggedIn: boolean, user? }
};

// -----------------------------
// 🔹 GET ALL SELLERS
// -----------------------------
export const getAllSellers = async () => {
  const data = await API.get("/sellers");
  return data; // { status, results, data: { sellers } }
};

// -----------------------------
// 🔹 GET ALL BUYERS
// -----------------------------
export const getAllBuyers = async () => {
  const data = await API.get("/buyers");
  return data; // { status, results, data: { users } }
};

// -----------------------------
