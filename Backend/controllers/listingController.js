import Listing from "../models/Listing.js";
import ProductView from "../models/ProductView.js";
import Newsletter from "../models/NewsLetter.js";
import { sendEmail } from "../utils/sendEmail.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import cloudinary from "../utils/cloudinary.js";
// Build MongoDB query
const buildQuery = ({ q, category, minPrice, maxPrice, owner, condition }) => {
  const query = {};
  if (q) query.$text = { $search: q };
  if (category && category !== "All Products")
    query.category = new RegExp(`^${category}$`, "i");
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

export const listListings = catchAsync(async (req, res) => {
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

  items.forEach((item) => {
    item.isFreeShipping = true;
    item.isOnSale = item.price < 50;
    item.isNewArrival =
      new Date() - new Date(item.createdAt) < 30 * 24 * 60 * 60 * 1000;
    item.isBestSeller = (item.popularity || 0) > 100;
  });

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
  const {
    title,
    description,
    price,
    category,
    condition,
    location,
    stock,
    sizes,
  } = req.body;
  if (!title || !description || !price || !location)
    return next(
      new AppError("title, description, price, and location are required", 400)
    );

  // Upload images to Cloudinary
  const files = req.files || [];
  const images = [];
  for (const f of files) {
    images.push({
      url: f.path || f.location,
      public_id: f.filename || f.public_id,
    });
  }

  const listing = await Listing.create({
    title,
    description,
    price,
    category,
    condition,
    location,
    stock: Number(stock) || 0,
    sizes: Array.isArray(sizes) ? sizes.map((s) => s.toString()) : [],
    images,
    owner: req.session.user._id,
  });

  // Notify newsletter subscribers
  const subscribers = await Newsletter.find({});
  for (const subscriber of subscribers) {
    await sendEmail({
      to: subscriber.email,
      subject: `New Product Added: ${listing.title}`,
      html: `<h2>New Product Alert!</h2><p><strong>${listing.title}</strong></p><p>${listing.description}</p><p>Price: $${listing.price}</p><a href="${process.env.FRONTEND_URL}/listings/${listing._id}" style="color: #F9A03F;">View Product</a>`,
    });
  }

  res.status(201).json(listing);
});

export const updateListing = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) return next(new AppError("Listing not found", 404));
  if (String(listing.owner) !== String(req.session.user._id))
    return next(new AppError("Not allowed", 403));

  // Delete old images from Cloudinary
  if (listing.images && listing.images.length) {
    for (const img of listing.images) {
      if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
    }
  }

  // Upload new images
  const files = req.files || [];
  const newImages = [];
  for (const f of files) {
    newImages.push({
      url: f.path || f.location,
      public_id: f.filename || f.public_id,
    });
  }

  Object.assign(listing, { ...req.body, images: newImages });
  const saved = await listing.save();

  res.json(saved);
});

export const deleteListing = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) return next(new AppError("Listing not found", 404));
  if (String(listing.owner) !== String(req.session.user._id))
    return next(new AppError("Not allowed", 403));

  // Delete images from Cloudinary
  if (listing.images && listing.images.length) {
    for (const img of listing.images) {
      if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
    }
  }

  await listing.deleteOne();
  res.status(200).json({ message: "Listing deleted successfully" });
});

export const getCategories = catchAsync(async (req, res, next) => {
  const categories = await Listing.distinct("category");
  res.json(categories);
});
