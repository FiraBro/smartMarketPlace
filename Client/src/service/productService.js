// productService.js
import axios from "axios";

// Base API
const PRODUCT_API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token if available
PRODUCT_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Track product view
export const trackProductView = async (productId) => {
  if (!productId) throw new Error("Product ID is required");
  const { data } = await PRODUCT_API.post(`/metrics/view/${productId}`);
  return data; // { product, views }
};

// Get popular products
export const getPopularProducts = async (limit = 12) => {
  const { data } = await PRODUCT_API.get(`/metrics/popular`, {
    // params: { limit },
  });
  // console.log(data);
  return data; // ✅ always an array
};

// Get top selling products
export const getTopSellingProducts = async () => {
  const { data } = await PRODUCT_API.get(`/metrics/most-sold`);
  return data; // [{ product, totalSold }, ...]
};

// Get newly added products
export const getNewProducts = async (limit = 10) => {
  const { data } = await PRODUCT_API.get(`/metrics/new`, {
    params: { limit },
  });
  return data; // [product1, product2, ...]
};
