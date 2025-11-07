// services/sellerService.js
import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_SELLER_URL || "http://localhost:5000/api/v1/seller",
  withCredentials: true, // ✅ include cookies/session
});

// ---------------------
// Seller Profile
// ---------------------
export const createSellerProfile = async (payload) => {
  const { data } = await API.post("/profile", payload);
  return data;
};

export const getSellerProfile = async () => {
  const { data } = await API.get("/profile");
  return data;
};

export const updateSellerProfile = async (payload) => {
  const { data } = await API.put("/profile", payload);
  return data;
};

// ---------------------
// Seller Products
// ---------------------
export const getSellerProducts = async () => {
  const { data } = await API.get("/products");
  return data;
};

export const createProduct = async (payload) => {
  // payload can include formData with images
  const { data } = await API.post("/products", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateProduct = async (id, payload) => {
  const { data } = await API.put(`/products/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await API.delete(`/products/${id}`);
  return data;
};

// ---------------------
// Seller Orders
// ---------------------
export const getSellerOrders = async () => {
  const { data } = await API.get("/orders");
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await API.put(`/orders/${id}/status`, { status });
  return data;
};
export const becomeSeller = async () => {
  try {
    const { data } = await API.post("/become-seller");
    console.log("becomeSeller response:", data);
    return data;
  } catch (error) {
    console.error("Error in becomeSeller:", error);
  }
};
export const getRecentOrder = async () => {
  try {
    const { data } = await API.get(`/recent-orders`); // make sure endpoint matches backend
    console.log(data);
    return data.data; // backend sends { success, results, data }
  } catch (error) {
    console.error("Failed to fetch recent orders:", error);
    return [];
  }
};
