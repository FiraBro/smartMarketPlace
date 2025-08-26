import axios from "axios";

// Base API for listings
const LISTING_API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token if needed
LISTING_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Search listings
export const searchListings = async (query, category) => {
  if (!query) return { items: [] };
  const { data } = await LISTING_API.get(`/listings`, {
    params: {
      q: query,
      category: category !== "All Categories" ? category : undefined,
    },
  });
  console.log(data.items);
  return data; // { items: [...], total, page, ... }
};
