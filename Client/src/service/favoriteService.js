// src/service/favoriteService.js
import axios from "axios";

// ✅ Base API instance for favorites endpoints
const FAVORITE_API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/favorites",
});

// ✅ Attach JWT token if available
FAVORITE_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ➕ Add a listing/product to favorites
export const addFavorite = async (product) => {
  const { data } = await FAVORITE_API.post("/", {
    listingId: product._id, // must match backend controller
  });
  return data;
};

// 🧾 Get user favorites
export const getFavorites = async () => {
  const { data } = await FAVORITE_API.get("/"); // returns full favorites object
  return {
    items: data.items.map((item) => ({
      _id: item.listing._id,
      name: item.listing.title,
      price: item.listing.price,
      image: item.listing.images?.[0]
        ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${
            item.listing.images[0]
          }`
        : "https://via.placeholder.com/200",
    })),
  };
};

// ❌ Remove a listing/product from favorites
// ❌ Remove a listing/product from favorites
export const removeFavorite = async (listingId) => {
  const { data } = await FAVORITE_API.delete("/", {
    data: { listingId }, // ✅ correct way to send body in DELETE
  });
  return data;
};

// 🧹 Clear all favorites
export const clearFavorites = async () => {
  const { data } = await FAVORITE_API.delete("/clear");
  return data;
};
