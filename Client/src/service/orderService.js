import axios from "axios";

const API_URL =
  import.meta.env.VITE_ORDER_URL || "http://localhost:5000/api/orders";

// Axios instance
const orderAPI = axios.create({
  baseURL: API_URL,
});

// Attach token
orderAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["Content-Type"] = "application/json";
  return config;
});

// Create order
export const createOrder = async ({
  products,
  address,
  paymentMethod,
  totalPrice,
  deliveryMethod,
}) => {
  try {
    const response = await orderAPI.post("/", {
      products,
      address, // string (_id)
      paymentMethod, // "COD" or "TeleBirr"
      totalPrice,
      deliveryMethod,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to create order";
    throw new Error(errorMessage);
  }
};

// Get user orders
export const getOrders = async () => {
  const { data } = await orderAPI.get("/myorders");
  return data;
};
export const getOrderById = async (orderId) => {
  const { data } = await orderAPI.get(`/${orderId}`);
  return data;
};
export const payWithCOD = async (orderId) => {
  const { data } = await orderAPI.post(`/${orderId}/pay/cod`);
  return data;
};
export const payWithTeleBirr = async (orderId, phone) => {
  const { data } = await orderAPI.post(`/${orderId}/pay/telebirr`, { phone });
  return data;
};
export const confirmOrder = async (orderId) => {
  const { data } = await orderAPI.post(`/${orderId}/confirm`);
  return data;
};
export const cancelOrder = async (orderId) => {
  const { data } = await orderAPI.post(`/${orderId}/cancel`);
  return data;
};
