// src/services/authService.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL_AUTH || "http://localhost:5000/api/admin";

// Always send cookies (sessions)
axios.defaults.withCredentials = true;

export const registerUser = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/registerAdmin`, data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/loginAdmin`, data);
  console.log("Login successful: ", res.data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.post(`${API_BASE_URL}/logoutAdmin`);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await axios.get(`${API_BASE_URL}/meAdmin`);
  console.log("getCurrentUser response data:", res.data);
  return res.data.data.admin; // important: return the admin object
};
export const getAllBuyer = async () => {
  const res = await axios.get(`${API_BASE_URL}/buyers`);
  console.log("getAllBuyer response data:", res.data);
  return res.data;
};

export const getAllSellers = async () => {
  const res = await axios.get(`${API_BASE_URL}/sellers`);
  return res.data;
};
export const getListingDetails = async () => {
  const res = await axios.get(`${API_BASE_URL}/listings/details`);
  console.log("getListingDetails response data:", res.data);
  return res.data;
};
