// context/FavoriteContext.js
import { createContext, useContext, useState, useEffect } from "react";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  clearFavorites,
} from "../service/favoriteService";

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data.items || []);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    }
  };

  const addToFavoritesContext = async (product) => {
    const normalized = {
      _id: product._id || product.id,
      name: product.name || product.title || "Unnamed Product",
      image:
        product.image ||
        product.images?.[0]?.url || // ✅ use .url if images[0] is object
        product.images?.[0] || // fallback if it’s string
        "https://via.placeholder.com/200",
      price: product.price || 0,
    };

    // Optimistically update local state
    setFavorites((prev) => {
      if (prev.find((item) => item._id === normalized._id)) return prev;
      return [...prev, normalized];
    });

    try {
      await addFavorite(normalized);
      fetchFavorites(); // sync with backend
    } catch (err) {
      console.error("Failed to add favorite:", err);
      fetchFavorites(); // rollback on error
    }
  };

  const removeFromFavoritesContext = async (_id) => {
    setFavorites((prev) => prev.filter((item) => item._id !== _id));

    try {
      await removeFavorite(_id); // now backend receives listingId
      fetchFavorites(); // keep frontend synced
    } catch (err) {
      console.error("Failed to remove favorite:", err);
      fetchFavorites(); // rollback in case of error
    }
  };

  const clearAllFavorites = async () => {
    setFavorites([]); // clear instantly
    try {
      await clearFavorites();
    } catch (err) {
      console.error("Failed to clear favorites:", err);
      fetchFavorites();
    }
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        fetchFavorites,
        addToFavorites: addToFavoritesContext,
        removeFromFavorites: removeFromFavoritesContext,
        clearFavorites: clearAllFavorites,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);
