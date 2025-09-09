import Listing from "../models/Listing.js";
import ProductView from "../models/ProductView.js";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Helper to process images to progressive
const processImage = async (file) => {
  const ext = path.extname(file.filename).toLowerCase();
  const inputPath = path.join(uploadDir, file.filename);
  const outputPath = inputPath; // overwrite original

  if (ext === ".jpg" || ext === ".jpeg") {
    await sharp(inputPath).jpeg({ progressive: true }).toFile(outputPath);
  } else if (ext === ".png") {
    await sharp(inputPath).png({ progressive: true }).toFile(outputPath);
  } else if (ext === ".webp") {
    await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath);
  }

  // Optional: generate tiny blurred placeholder
  const placeholder = await sharp(inputPath)
    .resize(20) // very small
    .blur()
    .toBuffer();

  const placeholderBase64 = `data:image/${ext.replace(
    ".",
    ""
  )};base64,${placeholder.toString("base64")}`;

  return { url: `/uploads/${file.filename}`, placeholder: placeholderBase64 };
};

// Build query for filters
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

// List all listings
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

// Get single listing
export const getListingById = catchAsync(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id).lean();
  if (!listing) return next(new AppError("Listing not found", 404));

  // Track views
  let view = await ProductView.findOne({ product: req.params.id });
  if (!view) view = new ProductView({ product: req.params.id, views: 1 });
  else view.views += 1;
  await view.save();

  res.json(listing);
});

// Create listing
export const createListing = catchAsync(async (req, res, next) => {
  const { title, description, price, category, condition, location } = req.body;
  if (!title || !description || !price)
    return next(
      new AppError("title, description, and price are required", 400)
    );

  const files = req.files || [];
  const images = [];
  for (const f of files) {
    const processed = await processImage(f);
    images.push({ url: processed.url, placeholder: processed.placeholder });
  }

  const listing = await Listing.create({
    title,
    description,
    price,
    category,
    condition,
    location,
    images,
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
  if (String(listing.owner) !== String(req.user._id))
    return next(new AppError("Not allowed", 403));

  let images = listing.images;
  const toRemove = Array.isArray(removeFiles)
    ? removeFiles
    : removeFiles
    ? String(removeFiles).split(",")
    : [];

  if (toRemove.length) {
    images = images.filter((img) => {
      if (toRemove.includes(img.url)) {
        const fullPath = path.join(process.cwd(), img.url);
        fs.unlink(fullPath, (err) => err && console.error(err));
        return false;
      }
      return true;
    });
  }

  const files = req.files || [];
  for (const f of files) {
    const processed = await processImage(f);
    images.push({ url: processed.url, placeholder: processed.placeholder });
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
  if (String(listing.owner) !== String(req.user._id))
    return next(new AppError("Not allowed", 403));

  listing.images.forEach((img) => {
    const fullPath = path.join(process.cwd(), img.url);
    fs.unlink(fullPath, (err) => err && console.error(err));
  });

  await listing.deleteOne();
  res.json({ message: "Listing deleted" });
});
