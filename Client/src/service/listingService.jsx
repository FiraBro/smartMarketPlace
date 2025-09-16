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

// Get single listing by ID
export const getListingById = async (id) => {
  if (!id) throw new Error("Listing ID is required");
  const { data } = await LISTING_API.get(`/listings/${id}`);
  return data; // single product object
};
// Get all listings with pagination
export const getAllListings = async (page = 1, limit = 12) => {
  const res = await LISTING_API.get(`/listings/all`, {
    params: { page, limit },
  });
  console.log(res);
  return res.data;
};
