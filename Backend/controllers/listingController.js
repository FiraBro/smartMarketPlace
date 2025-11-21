import catchAsync from "../utils/catchAsync.js";
import * as listingService from "../services/listingService.js";

// Public routes
export const listListings = catchAsync(async (req, res) => {
  const result = await listingService.listListingsService(req.query);
  res.json(result);
});

export const getListingById = catchAsync(async (req, res, next) => {
  const result = await listingService.getListingByIdService(req.params.id);
  res.json(result);
});

export const getCategories = catchAsync(async (req, res, next) => {
  const categories = await listingService.getCategoriesService();
  res.json(categories);
});

export const getListingDetails = catchAsync(async (req, res, next) => {
  const result = await listingService.getListingDetailsService();
  res.status(200).json({ status: "success", data: result });
});

// Protected routes
export const createListing = catchAsync(async (req, res, next) => {
  const listing = await listingService.createListingService(
    req.session.user._id,
    req.body,
    req.files
  );
  res.status(201).json(listing);
});

export const updateListing = catchAsync(async (req, res, next) => {
  const listing = await listingService.updateListingService(
    req.session.user._id,
    req.params.id,
    req.body,
    req.files
  );
  res.json(listing);
});

export const deleteListing = catchAsync(async (req, res, next) => {
  await listingService.deleteListingService(
    req.session.user._id,
    req.params.id
  );
  res.status(200).json({ message: "Listing deleted successfully" });
});
