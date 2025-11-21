import catchAsync from "../utils/catchAsync.js";
import * as favoriteService from "../services/favoriteService.js";

// ✅ Get current user's favorites
export const getFavorites = catchAsync(async (req, res, next) => {
  const favorites = await favoriteService.getFavoritesService(
    req.session.user._id
  );
  res.json(favorites);
});

// ✅ Add listing to favorites
export const addToFavorites = catchAsync(async (req, res, next) => {
  const { listingId } = req.body;
  const favorites = await favoriteService.addToFavoritesService(
    req.session.user._id,
    listingId
  );
  res.json(favorites);
});

// ✅ Remove listing from favorites
export const removeFromFavorites = catchAsync(async (req, res, next) => {
  const { listingId } = req.body;
  const favorites = await favoriteService.removeFromFavoritesService(
    req.session.user._id,
    listingId
  );
  res.json(favorites);
});

// ✅ Clear all favorites
export const clearFavorites = catchAsync(async (req, res, next) => {
  const favorites = await favoriteService.clearFavoritesService(
    req.session.user._id
  );
  res.json(favorites);
});
