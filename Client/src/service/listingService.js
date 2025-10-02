// listingService.js
import axios from "axios";

// Base API for listings
const LISTING_API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000, // Add timeout
});

// Attach token if needed
LISTING_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
LISTING_API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Get listings by category with pagination
export const getListingsByCategory = async (category, page = 1, limit = 12) => {
  try {
    const params = { page, limit };
    if (category && category !== "All") {
      params.category = category;
    }

    const { data } = await LISTING_API.get("/listings", { params });
    return data;
  } catch (error) {
    console.error("Error in getListingsByCategory:", error);
    throw error;
  }
};

// Get all distinct categories for pills
export const getAllCategories = async () => {
  try {
    const { data } = await LISTING_API.get("/listings/categories");
    console.log("Categories API Response:", data); // Debug log
    return data;
  } catch (error) {
    console.error("Error in getAllCategories:", error);

    // Return empty array as fallback
    if (error.response?.status === 500) {
      console.warn(
        "Server error fetching categories, using fallback categories"
      );
      return []; // Return empty array instead of crashing
    }
    throw error;
  }
};

// Search listings
export const searchListings = async (query, category) => {
  try {
    if (!query) return { items: [] };
    const { data } = await LISTING_API.get(`/listings`, {
      params: {
        q: query,
        category: category !== "All Categories" ? category : undefined,
      },
    });
    return data;
  } catch (error) {
    console.error("Error in searchListings:", error);
    return { items: [] }; // Return empty results on error
  }
};

// Get single listing by ID
export const getListingById = async (id) => {
  try {
    if (!id) throw new Error("Listing ID is required");
    const { data } = await LISTING_API.get(`/listings/${id}`);
    return data;
  } catch (error) {
    console.error("Error in getListingById:", error);
    throw error;
  }
};

// Get all listings with pagination
export const getAllListings = async (page = 1, limit = 12) => {
  try {
    const res = await LISTING_API.get(`/listings/all`, {
      params: { page, limit },
    });
    return res.data;
  } catch (error) {
    console.error("Error in getAllListings:", error);
    throw error;
  }
};
