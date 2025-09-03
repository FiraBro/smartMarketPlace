// src/services/cartService.js
import axios from "axios";

// ✅ Base API instance for cart endpoints
const CART_API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/cart",
});

// ✅ Attach JWT token if available
CART_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ➕ Add item to cart
export const addToCart = async (listingId, quantity = 1) => {
  const { data } = await CART_API.post("/add", {
    listingId, // ✅ must match backend controller
    quantity,
  });
  return data;
};

// 🛒 Get user cart
// service/cartService.js
export const getCart = async () => {
  const { data } = await CART_API.get("/"); // returns full cart object
  return {
    items: data.items.map((item) => ({
      id: item.listing._id, // map to frontend id
      name: item.listing.title,
      price: item.listing.price,
      image: item.listing.images?.[0]
        ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${
            item.listing.images[0]
          }`
        : "https://via.placeholder.com/200",
      quantity: item.quantity,
    })),
  };
};

// ✏️ Update cart item quantity
export const updateCartItem = async (listingId, quantity) => {
  const { data } = await CART_API.put("/update", {
    listingId,
    quantity,
  });
  return data;
};

// ❌ Remove item from cart
export const removeFromCart = async (listingId) => {
  const { data } = await CART_API.delete("/remove", {
    data: { listingId }, // axios requires `data` for DELETE body
  });
  return data;
};

// 🧹 Clear all items from cart
export const clearCart = async () => {
  const { data } = await CART_API.delete("/clear");
  return data;
};
