import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL_AUTH || "http://localhost:4000/api/auth";

// Always send cookies (sessions)
axios.defaults.withCredentials = true;

export const registerUser = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/register`, data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/login`, data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.post(`${API_BASE_URL}/logout`);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await axios.get(`${API_BASE_URL}/me`);
  return res.data.user;
};
