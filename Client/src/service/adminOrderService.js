// src/services/orderService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/orders";

// ✅ Get all orders (admin)
export const getAllOrders = async () => {
  try {
    const res = await axios.get(API_URL, { withCredentials: true });
    console.log(res);
    return res.data; // should be array of orders
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

// ✅ Verify payment for a product
export const verifyPayment = async (orderId, productId) => {
  try {
    const res = await axios.post(
      `${API_URL}/${orderId}/products/${productId}/verify-payment`,
      {},
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Error verifying payment:", error);
  }
};

// ✅ Release funds to seller
export const releaseFunds = async (orderId, productId) => {
  try {
    const res = await axios.post(
      `${API_URL}/${orderId}/products/${productId}/release-funds`,
      {},
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Error releasing funds:", error);
  }
};
