import axios from "axios";

// ✅ Base API instance for favorites endpoints (session-based)
const FAVORITE_API = axios.create({
  baseURL:
    import.meta.env.VITE_FAV_URL || "http://localhost:5000/api/v1/favorites",
  withCredentials: true, // ✅ send session cookies automatically
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
  const { data } = await FAVORITE_API.get("/"); // full favorites object
  return {
    items: data.items
      .map((item) => {
        const listing = item.listing;

        if (!listing) return null;

        // Choose the first image URL
        const imageUrl = listing.images?.[0]?.url || listing.image || "";

        // Only prepend BASE_URL if it's a relative path
        const finalImage = imageUrl.startsWith("http")
          ? imageUrl
          : `${import.meta.env.VITE_BASE_URL}${imageUrl}`;

        return {
          _id: listing._id,
          name: listing.title || listing.name || "Unnamed Product",
          price: listing.price || 0,
          image: finalImage || "https://via.placeholder.com/200",
        };
      })
      .filter(Boolean),
  };
};

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
