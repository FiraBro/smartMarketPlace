import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/orders";

const config = {
  withCredentials: true, // ✅ Send session cookies
};

// ==========================
// BUYER ROUTES
// ==========================

export const createOrder = async (orderData) => {
  const { data } = await axios.post(`${API_URL}`, orderData, config);
  return data;
};

export const getMyOrders = async () => {
  const { data } = await axios.get(`${API_URL}/my-orders`, config);
  return data;
};

export const getOrderById = async (orderId) => {
  const { data } = await axios.get(`${API_URL}/${orderId}`, config);
  return data;
};

export const cancelOrder = async (orderId) => {
  const { data } = await axios.delete(`${API_URL}/${orderId}/cancel`, config);
  return data;
};

export const uploadPaymentProof = async (
  orderId,
  productId,
  file,
  transactionId
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("transactionId", transactionId);

  const { data } = await axios.post(
    `${API_URL}/${orderId}/products/${productId}/payment-proof`,
    formData,
    { ...config, headers: { "Content-Type": "multipart/form-data" } }
  );

  return data;
};

export const confirmDelivery = async (orderId, productId) => {
  const { data } = await axios.post(
    `${API_URL}/${orderId}/products/${productId}/confirm-delivery`,
    {},
    config
  );
  return data;
};

export const disputeProduct = async (orderId, productId, reason, message) => {
  const { data } = await axios.post(
    `${API_URL}/${orderId}/products/${productId}/dispute`,
    { reason, message },
    config
  );
  return data;
};

// ==========================
// SELLER ROUTES
// ==========================

export const getSellerOrders = async () => {
  const { data } = await axios.get(`${API_URL}/seller/orders`, config);
  console.log("🟢 Seller Orders (frontend):", data);
  return data;
};

export const updateSellerOrderStatus = async (orderId, status) => {
  const { data } = await axios.patch(
    `${API_URL}/seller/products/status`,
    { orderId, status },
    config
  );
  return data;
};

export const markAsShipped = async (orderId, productId, trackingData = {}) => {
  // trackingData = { courier: "DHL", trackingNumber: "123456" }
  const { data } = await axios.post(
    `${API_URL}/${orderId}/products/${productId}/ship`,
    trackingData, // send courier/tracking info
    config
  );
  return data;
};

// ==========================
// ADMIN ROUTES
// ==========================

export const getAllOrders = async () => {
  const { data } = await axios.get(`${API_URL}`, config);
  return data;
};

export const verifyPayment = async (orderId, productId) => {
  const { data } = await axios.post(
    `${API_URL}/${orderId}/products/${productId}/verify-payment`,
    {},
    config
  );
  return data;
};

export const releaseFunds = async (orderId, productId) => {
  const { data } = await axios.post(
    `${API_URL}/${orderId}/products/${productId}/release-funds`,
    {},
    config
  );
  return data;
};
