// src/service/orderService.js
import axios from "axios";

const API_URL =
  import.meta.env.VITE_ORDER_URL || "http://localhost:5000/api/orders";

// ✅ Axios instance
const orderAPI = axios.create({
  baseURL: API_URL,
});

// ✅ Attach JWT token to every request
orderAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["Content-Type"] = "application/json";
  return config;
});

// ✅ Create a new order
export const createOrder = async ({
  products,
  address,
  paymentMethod,
  totalPrice,
  deliveryMethod,
}) => {
  try {
    const { data } = await orderAPI.post("/", {
      products,
      address,
      paymentMethod,
      totalPrice,
      deliveryMethod,
    });
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to create order";
    throw new Error(errorMessage);
  }
};

// ✅ Get all orders for the logged-in user
export const getOrders = async () => {
  try {
    const { data } = await orderAPI.get("/myorders");
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to load orders";
    throw new Error(errorMessage);
  }
};

// ✅ Get a single order by ID
export const getOrderById = async (orderId) => {
  try {
    const { data } = await orderAPI.get(`/${orderId}`);
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch order details";
    throw new Error(errorMessage);
  }
};

// ✅ Pay with Cash on Delivery (COD)
export const payWithCOD = async (orderId) => {
  try {
    const { data } = await orderAPI.put(`/${orderId}/pay`, {
      paymentMethod: "COD",
    });
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to confirm COD payment";
    throw new Error(errorMessage);
  }
};

// ✅ Pay with TeleBirr (online)
export const payWithTeleBirr = async (orderId, phone) => {
  try {
    const { data } = await orderAPI.put(`/${orderId}/pay`, {
      paymentMethod: "TeleBirr",
      phone,
    });
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "TeleBirr payment failed";
    throw new Error(errorMessage);
  }
};

// ✅ Confirm order after payment
export const confirmOrder = async (orderId) => {
  try {
    const { data } = await orderAPI.post(`/${orderId}/confirm`);
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to confirm order";
    throw new Error(errorMessage);
  }
};

// ✅ Cancel an order
export const cancelOrder = async (orderId) => {
  try {
    const { data } = await orderAPI.delete(`/${orderId}`);
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to cancel order";
    throw new Error(errorMessage);
  }
};
