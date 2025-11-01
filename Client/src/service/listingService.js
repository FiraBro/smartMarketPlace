import axios from "axios";

// ✅ Base API for listings (session-based)
const LISTING_API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // ✅ send session cookies
});

// Response interceptor to handle errors
LISTING_API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Get listings by category with pagination
export const getListingsByCategory = async (category, page = 1, limit = 12) => {
  try {
    const params = { page, limit };
    if (category && category !== "All") params.category = category;

    const { data } = await LISTING_API.get("/listings", { params });
    return data;
  } catch (error) {
    console.error("Error in getListingsByCategory:", error);
    throw error;
  }
};

// Create a new listing (multipart/form-data)
export const createListing = async (payload) => {
  try {
    const { data } = await LISTING_API.post("/listings/create", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    console.error("Error in createListing:", error);
    throw error;
  }
};

// Get all distinct categories
// export const getAllCategories = async () => {
//   try {
//     const { data } = await LISTING_API.get("/listings/categories");
//     return data;
//   } catch (error) {
//     console.error("Error in getAllCategories:", error);
//     if (error.response?.status === 500) {
//       console.warn("Server error fetching categories, returning fallback []");
//       return [];
//     }
//     throw error;
//   }
// };

// Search listings
export const searchListings = async (query, category) => {
  try {
    if (!query) return { items: [] };
    const { data } = await LISTING_API.get(`/listings`, {
      params: {
        q: query,
        category: category !== "All Categories" ? category : undefined,
      },
    });
    return data;
  } catch (error) {
    console.error("Error in searchListings:", error);
    return { items: [] }; // Return empty results on error
  }
};

// Get single listing by ID
export const getListingById = async (id) => {
  try {
    if (!id) throw new Error("Listing ID is required");
    const { data } = await LISTING_API.get(`/listings/${id}`);
    return data;
  } catch (error) {
    console.error("Error in getListingById:", error);
    throw error;
  }
};

// ✅ Get all listings with pagination, filters, search, and sort
export const getAllListings = async ({
  page = 1,
  limit = 12,
  sortBy = "newest",
  q = "",
  category = "",
  minPrice,
  maxPrice,
} = {}) => {
  try {
    const params = { page, limit, sortBy };
    if (q) params.q = q;
    if (category && category !== "All Products") params.category = category;
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;

    const { data } = await LISTING_API.get(`/listings/all`, { params });

    // Optional: Compute frontend-friendly flags
    data.items.forEach((item) => {
      item.isFreeShipping = true;
      item.isOnSale = item.price < 50;
      item.isNewArrival = (new Date() - new Date(item.createdAt)) < 30 * 24 * 60 * 60 * 1000; // 30 days
      item.isBestSeller = (item.popularity || 0) > 100;
    });

    return data;
  } catch (error) {
    console.error("Error in getAllListings:", error);
    throw error;
  }
};

// Update a listing (multipart/form-data)
export const updateListing = async (id, formData) => {
  try {
    const { data } = await LISTING_API.patch(`/listings/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    console.error("Error in updateListing:", error);
    throw error;
  }
};

// Delete a listing by ID (seller only)
export const deleteListing = async (id) => {
  try {
    if (!id) throw new Error("Listing ID is required");
    const { data } = await LISTING_API.delete(`/listings/${id}`);
    return data;
  } catch (error) {
    console.error("Error in deleteListing:", error);
    throw error;
  }
};
