import axios from "axios";

// ✅ Base API instance for category/listing endpoints (session-based)
const CATEGORY_API = axios.create({
  baseURL:
    import.meta.env.VITE_CATEGORY_URL || "http://localhost:5000/api/listings",
  withCredentials: true, // ✅ send session cookies automatically
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
