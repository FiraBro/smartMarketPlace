import Listing from "../models/Listing.js";
import ProductView from "../models/ProductView.js";
import Newsletter from "../models/NewsLetter.js";
import { sendEmail } from "../utils/sendEmail.js";
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
  const tempPath = path.join(uploadDir, `temp-${file.filename}`);

  let buffer;

  if (ext === ".jpg" || ext === ".jpeg") {
    buffer = await sharp(inputPath).jpeg({ progressive: true }).toBuffer();
  } else if (ext === ".png") {
    buffer = await sharp(inputPath).png({ progressive: true }).toBuffer();
  } else if (ext === ".webp") {
    buffer = await sharp(inputPath).webp({ quality: 80 }).toBuffer();
  } else {
    return { url: `/uploads/${file.filename}`, placeholder: null };
  }

  // write to temp file
  await fs.promises.writeFile(tempPath, buffer);

  // replace original (avoids OneDrive lock issue)
  await fs.promises.rename(tempPath, inputPath);

  // generate tiny blurred placeholder
  const placeholder = await sharp(buffer).resize(20).blur().toBuffer();
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

// Get single listing + related
export const getListingById = catchAsync(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id).lean();
  if (!listing) return next(new AppError("Listing not found", 404));

  // Track views
  let view = await ProductView.findOne({ product: req.params.id });
  if (!view) view = new ProductView({ product: req.params.id, views: 1 });
  else view.views += 1;
  await view.save();

  // 🔹 Find related products (same category, not this product)
  const related = await Listing.find({
    category: listing.category,
    _id: { $ne: listing._id },
  })
    .limit(4) // show max 4 related
    .lean();

  res.json({ listing, related });
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

  // Send email to all newsletter subscribers
  const subscribers = await Newsletter.find({});
  for (const subscriber of subscribers) {
    await sendEmail({
      to: subscriber.email,
      subject: `New Product Added: ${listing.title}`,
      html: `
        <h2>New Product Alert!</h2>
        <p><strong>${listing.title}</strong></p>
        <p>${listing.description}</p>
        <p>Price: $${listing.price}</p>
        <a href="${process.env.FRONTEND_URL}/listings/${listing._id}" style="color: #F9A03F;">View Product</a>
      `,
    });
  }

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
// Get all listings with pagination only
export const getAllListings = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 12, sort = "-createdAt" } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const pageSize = Math.min(60, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * pageSize;

  const [items, total] = await Promise.all([
    Listing.find().sort(sort).skip(skip).limit(pageSize).lean(),
    Listing.countDocuments(),
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

// Get all distinct categories
export const getCategories = catchAsync(async (req, res, next) => {
  try {
    const categories = await Listing.distinct("category");
    res.json(categories);
  } catch (err) {
    next(new AppError("Failed to fetch categories", 500));
  }
});
