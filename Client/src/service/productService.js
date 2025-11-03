// productService.js
import axios from "axios";

// Base API
const PRODUCT_API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials:true
});

// Attach token if available

PRODUCT_API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
// Track product view
export const trackProductView = async (productId) => {
  if (!productId) throw new Error("Product ID is required");
  const { data } = await PRODUCT_API.post(`/metrics/view/${productId}`);
  console.log(data)
  return data; // { product, views }
};

// Get popular products
export const getPopularProducts = async (limit = 12) => {
  const { data } = await PRODUCT_API.get(`/metrics/popular`, {
    params: { limit },
  });
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
