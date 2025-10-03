// src/service/addressService.js
import axios from "axios";

// ✅ Base API instance for address endpoints
const ADDRESS_API = axios.create({
  baseURL:
    import.meta.env.VITE_ADDRESS_URL || "http://localhost:5000/api/addresses",
});

// ✅ Attach JWT token if available
ADDRESS_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 📍 Get all addresses for the logged-in user
export const getAddresses = async () => {
  const { data } = await ADDRESS_API.get("/");
  return data; // array of addresses
};

// ➕ Create a new address
export const createAddress = async (addressData) => {
  const { data } = await ADDRESS_API.post("/", addressData);
  return data; // created address
};

// ✏️ Update an address by ID
export const updateAddress = async (id, addressData) => {
  const { data } = await ADDRESS_API.put(`/${id}`, addressData);
  return data; // updated address
};

// ❌ Delete an address by ID
export const deleteAddress = async (id) => {
  const { data } = await ADDRESS_API.delete(`/${id}`);
  return data; // success response
};
