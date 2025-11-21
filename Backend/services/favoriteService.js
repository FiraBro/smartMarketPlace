import Favorite from "../models/Favorite.js";
import Listing from "../models/Listing.js";
import AppError from "../utils/AppError.js";

/**
 * Get current user's favorites
 */
export const getFavoritesService = async (userId) => {
  const favorites = await Favorite.findOne({ user: userId }).populate(
    "items.listing"
  );
  return favorites || { items: [] };
};

/**
 * Add a listing to favorites
 */
export const addToFavoritesService = async (userId, listingId) => {
  const listing = await Listing.findById(listingId);
  if (!listing) throw new AppError("Listing not found", 404);

  let favorites = await Favorite.findOne({ user: userId });
  if (!favorites) {
    favorites = new Favorite({ user: userId, items: [{ listing: listingId }] });
  } else {
    const itemExists = favorites.items.find(
      (item) => item.listing.toString() === listingId
    );
    if (itemExists) return favorites; // Already in favorites
    favorites.items.push({ listing: listingId });
  }

  await favorites.save();
  return favorites;
};

/**
 * Remove a listing from favorites
 */
export const removeFromFavoritesService = async (userId, listingId) => {
  const favorites = await Favorite.findOne({ user: userId });
  if (!favorites) throw new AppError("Favorites not found", 404);

  favorites.items = favorites.items.filter(
    (item) => item.listing.toString() !== listingId
  );
  await favorites.save();
  return favorites;
};

/**
 * Clear all favorites
 */
export const clearFavoritesService = async (userId) => {
  const favorites = await Favorite.findOne({ user: userId });
  if (!favorites) throw new AppError("Favorites not found", 404);

  favorites.items = [];
  await favorites.save();
  return favorites;
};
