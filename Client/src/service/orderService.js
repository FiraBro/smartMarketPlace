// src/services/orderService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Create axios instance with base configuration
const orderAPI = axios.create({
  baseURL: `${API_URL}/api`,
});

// Add auth token interceptor
orderAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["Content-Type"] = "application/json";
  return config;
});

// ✅ Create an order
export const createOrder = async ({ products, address, payment, total }) => {
  try {
    const response = await orderAPI.post("/orders", {
      products,
      address,
      payment,
      total,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to create order";
    throw new Error(errorMessage);
  }
};

// ✅ Get all orders (user → own orders, admin → all orders)
export const getOrders = async () => {
  try {
    const response = await orderAPI.get("/orders/myorders");
    console.log("getOrders response data:", response.data); // Debugging line
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch orders";
    throw new Error(errorMessage);
  }
};

// ✅ Get a single order by ID
export const getOrderById = async (id) => {
  try {
    const response = await orderAPI.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch order";
    throw new Error(errorMessage);
  }
};

// ✅ Update order status (admin only)
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await orderAPI.put(`/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to update order status";
    throw new Error(errorMessage);
  }
};

// ✅ Mark order as paid
export const payOrder = async (id) => {
  try {
    const response = await orderAPI.put(`/orders/${id}/pay`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to mark order as paid";
    throw new Error(errorMessage);
  }
};

// ✅ Cancel/Delete order
export const cancelOrder = async (id) => {
  try {
    const response = await orderAPI.delete(`/orders/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to cancel order";
    throw new Error(errorMessage);
  }
};
