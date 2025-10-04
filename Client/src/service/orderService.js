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
}) => {
  try {
    const response = await orderAPI.post("/", {
      products,
      address, // string (_id)
      paymentMethod, // "COD" or "TeleBirr"
      totalPrice,
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
