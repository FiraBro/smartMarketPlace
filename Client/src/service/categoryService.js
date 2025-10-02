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

// 🛍️ Fetch products by category
export const fetchProductsByCategory = async (
  category,
  page = 1,
  limit = 12
) => {
  const { data } = await CATEGORY_API.get("/", {
    params: { category, page, limit },
  });
  // Normalize products like in cart service
  return {
    items: data.items.map((item) => {
      const imagePath = item.images?.[0]?.url || item.images?.[0] || null;

      return {
        id: item._id,
        name: item.title || "Untitled",
        price: item.price || 0,
        image: imagePath
          ? `${
              import.meta.env.VITE_STATIC_URL || "http://localhost:5000"
            }${imagePath}`
          : "https://via.placeholder.com/200",
        condition: item.condition,
        category: item.category,
      };
    }),
    pagination: {
      page: data.page,
      total: data.total,
      totalPages: data.totalPages,
      hasNextPage: data.hasNextPage,
    },
  };
};
// 🛒 Fetch all categories (optional if you store categories in DB)
export const fetchAllCategories = async () => {
  const { data } = await CATEGORY_API.get("/categories");
  return data; // e.g. ["Cosmetics", "Accessories", "Footwear", "Clothing"]
};
