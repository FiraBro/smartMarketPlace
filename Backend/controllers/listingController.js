import Listing from "../models/Listing.js";
import ProductView from "../models/ProductView.js";
import Newsletter from "../models/NewsLetter.js";
import { sendEmail } from "../utils/sendEmail.js";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import { promisify } from "util";
const unlinkAsync = promisify(fs.unlink);

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

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

  await fs.promises.writeFile(tempPath, buffer);
  await fs.promises.rename(tempPath, inputPath);

  const placeholder = await sharp(buffer).resize(20).blur().toBuffer();
  const placeholderBase64 = `data:image/${ext.replace(
    ".",
    ""
  )};base64,${placeholder.toString("base64")}`;

  return { url: `/uploads/${file.filename}`, placeholder: placeholderBase64 };
};

const buildQuery = ({ q, category, minPrice, maxPrice, owner, condition }) => {
  const query = {};
  if (q) query.$text = { $search: q };
  if (category) query.category = new RegExp(`^${category}$`, "i");
  if (owner) query.owner = owner;
  if (condition) query.condition = condition;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  return query;
};

// -----------------
// Listings APIs
// -----------------

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

export const getListingById = catchAsync(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id).lean();
  if (!listing) return next(new AppError("Listing not found", 404));

  let view = await ProductView.findOne({ product: req.params.id });
  if (!view) view = new ProductView({ product: req.params.id, views: 1 });
  else view.views += 1;
  await view.save();

  const related = await Listing.find({
    category: listing.category,
    _id: { $ne: listing._id },
  })
    .limit(4)
    .lean();

  res.json({ listing, related });
});

// -----------------
// Protected routes
// -----------------

export const createListing = catchAsync(async (req, res, next) => {
  const { title, description, price, category, condition, location } = req.body;
  if (!title || !description || !price || !location)
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
    owner: req.session.user._id, // <-- session-based
  });

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
  console.log(listing);
  res.status(201).json(listing);
});

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
  if (String(listing.owner) !== String(req.session.user._id))
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
export const deleteListing = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // 1️⃣ Find the listing
  const listing = await Listing.findById(id);
  if (!listing) return next(new AppError("Listing not found", 404));

  // 2️⃣ Check ownership
  if (String(listing.owner) !== String(req.session.user._id)) {
    return next(new AppError("Not allowed to delete this listing", 403));
  }

  // 3️⃣ Delete images from filesystem
  for (const img of listing.images) {
    try {
      // adjust this based on how you save image paths
      const fullPath = path.join(process.cwd(), img.url);
      await unlinkAsync(fullPath);
    } catch (err) {
      console.error("Error deleting image:", err.message);
      // don't throw here — allow listing deletion to continue
    }
  }

  // 4️⃣ Delete the listing document
  await listing.deleteOne();

  // 5️⃣ Send success response
  res.status(200).json({ message: "Listing deleted successfully" });
});

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

export const getCategories = catchAsync(async (req, res, next) => {
  try {
    const categories = await Listing.distinct("category");
    res.json(categories);
  } catch (err) {
    next(new AppError("Failed to fetch categories", 500));
  }
});
