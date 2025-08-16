import Listing from "../models/Listing.js";
import ProductView from "../models/ProductView.js";
import fs from "fs";
import path from "path";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

const buildQuery = ({ q, category, minPrice, maxPrice, owner, condition }) => {
  const query = {};
  if (q) query.$text = { $search: q };
  if (category) query.category = category;
  if (owner) query.owner = owner;
  if (condition) query.condition = condition;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  return query;
};

// List all listings with filters and pagination
export const listListings = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 12,
    sort = "-createdAt",
    q,
    category,
    minPrice,
    maxPrice,
    owner,
    condition,
  } = req.query;

  const query = buildQuery({
    q,
    category,
    minPrice,
    maxPrice,
    owner,
    condition,
  });

  const pageNum = Math.max(1, parseInt(page));
  const pageSize = Math.min(60, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * pageSize;

  const [items, total] = await Promise.all([
    Listing.find(query).sort(sort).skip(skip).limit(pageSize).lean(),
    Listing.countDocuments(query),
  ]);

  res.json({
    page: pageNum,
    limit: pageSize,
    total,
    totalPages: Math.ceil(total / pageSize) || 1,
    hasNextPage: skip + items.length < total,
    items,
  });
});

// Get single listing by ID
export const getListingById = catchAsync(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id).lean();
  if (!listing) return next(new AppError("Listing not found", 404));

  // Track views
  let view = await ProductView.findOne({ product: req.params.id });
  if (!view) {
    view = new ProductView({ product: req.params.id, views: 1 });
  } else {
    view.views += 1;
  }
  await view.save();

  res.json(listing);
});

// Create listing
export const createListing = catchAsync(async (req, res, next) => {
  const { title, description, price, category, condition, location } = req.body;
  if (!title || !description || !price) {
    return next(
      new AppError("title, description, and price are required", 400)
    );
  }

  const files = req.files || [];
  const filePaths = files.map((f) => `/uploads/${f.filename}`);

  const listing = await Listing.create({
    title,
    description,
    price,
    category,
    condition,
    location,
    images: filePaths,
    owner: req.user._id,
  });

  res.status(201).json(listing);
});

// Update listing
export const updateListing = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    description,
    price,
    category,
    condition,
    location,
    removeFiles,
  } = req.body;

  const listing = await Listing.findById(id);
  if (!listing) return next(new AppError("Listing not found", 404));
  if (String(listing.owner) !== String(req.user._id)) {
    return next(new AppError("Not allowed", 403));
  }

  let images = listing.images;
  const toRemove = Array.isArray(removeFiles)
    ? removeFiles
    : removeFiles
    ? String(removeFiles).split(",")
    : [];

  if (toRemove.length) {
    images = images.filter((imgPath) => {
      if (toRemove.includes(imgPath)) {
        const fullPath = path.join(process.cwd(), imgPath);
        fs.unlink(fullPath, (err) => {
          if (err) console.error(err);
        });
        return false;
      }
      return true;
    });
  }

  const files = req.files || [];
  if (files.length) {
    const newPaths = files.map((f) => `/uploads/${f.filename}`);
    images = images.concat(newPaths);
  }

  Object.assign(listing, {
    title,
    description,
    price,
    category,
    condition,
    location,
    images,
  });

  const saved = await listing.save();
  res.json(saved);
});

// Delete listing
export const deleteListing = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) return next(new AppError("Listing not found", 404));
  if (String(listing.owner) !== String(req.user._id)) {
    return next(new AppError("Not allowed", 403));
  }

  listing.images.forEach((imgPath) => {
    const fullPath = path.join(process.cwd(), imgPath);
    fs.unlink(fullPath, (err) => {
      if (err) console.error(err);
    });
  });

  await listing.deleteOne();
  res.json({ message: "Listing deleted" });
});
