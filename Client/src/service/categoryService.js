import axios from "axios";

// ✅ Base API instance for category/listing endpoints
const CATEGORY_API = axios.create({
  baseURL:
    import.meta.env.VITE_CATEGORY_URL || "http://localhost:5000/api/listings",
});

// ✅ Attach JWT token if available (not always required for browsing, but safe)
CATEGORY_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🛍️ Fetch products by category (no normalization)
export const fetchProductsByCategory = async (
  category,
  page = 1,
  limit = 12
) => {
  const { data } = await CATEGORY_API.get("/", {
    params: { category, page, limit },
  });
  return data; // ✅ return raw backend response directly
};

// 🛒 Fetch all categories
export const fetchAllCategories = async () => {
  const { data } = await CATEGORY_API.get("/categories");
  return data; // e.g. ["Cosmetics", "Accessories", "Footwear", "Clothing"]
};
