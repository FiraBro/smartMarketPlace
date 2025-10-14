import Favorite from "../models/Favorite.js";
import Listing from "../models/Listing.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

// ✅ Get current user's favorites
export const getFavorites = catchAsync(async (req, res, next) => {
  const favorites = await Favorite.findOne({
    user: req.session.user._id,
  }).populate("items.listing");

  if (!favorites) return res.json({ items: [] });

  res.json(favorites);
});

// ✅ Add a listing to favorites
export const addToFavorites = catchAsync(async (req, res, next) => {
  const { listingId } = req.body;

  const listing = await Listing.findById(listingId);
  if (!listing) return next(new AppError("Listing not found", 404));

  let favorites = await Favorite.findOne({ user: req.session.user._id });
  if (!favorites) {
    favorites = new Favorite({
      user: req.session.user._id,
      items: [{ listing: listingId }],
    });
  } else {
    const itemExists = favorites.items.find(
      (item) => item.listing.toString() === listingId
    );
    if (itemExists) return res.status(200).json(favorites); // already in favorites

    favorites.items.push({ listing: listingId });
  }

  await favorites.save();
  res.json(favorites);
});

// ✅ Remove a listing from favorites
export const removeFromFavorites = catchAsync(async (req, res, next) => {
  const { listingId } = req.body;

  const favorites = await Favorite.findOne({ user: req.session.user._id });
  if (!favorites) return next(new AppError("Favorites not found", 404));

  favorites.items = favorites.items.filter(
    (item) => item.listing.toString() !== listingId
  );
  await favorites.save();

  res.json(favorites);
});

// ✅ Clear all favorites
export const clearFavorites = catchAsync(async (req, res, next) => {
  const favorites = await Favorite.findOne({ user: req.session.user._id });
  if (!favorites) return next(new AppError("Favorites not found", 404));

  favorites.items = [];
  await favorites.save();

  res.json(favorites);
});
