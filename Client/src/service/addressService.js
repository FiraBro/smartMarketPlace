// src/service/addressService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/addresses";

export const getAddresses = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addAddress = async (data) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateAddress = async (id, data) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteAddress = async (id) => {
  const token = localStorage.getItem("token");
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
