import Listing from "../models/Listing.js";
import ProductView from "../models/ProductView.js";
import fs from "fs";
import path from "path";

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

export const listListings = async (req, res) => {
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
};

export const getListingById = async (req, res) => {
  const listing = await Listing.findById(req.params.id).lean();
  if (!listing) return res.status(404).json({ message: "Listing not found" });

  // Increment view count
  let view = await ProductView.findOne({ product: req.params.id });
  if (!view) {
    view = new ProductView({ product: req.params.id, views: 1 });
  } else {
    view.views += 1;
  }
  await view.save();

  res.json(listing);
};

export const createListing = async (req, res) => {
  const { title, description, price, category, condition, location } = req.body;
  if (!title || !description || !price) {
    return res
      .status(400)
      .json({ message: "title, description, and price are required" });
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
};

export const updateListing = async (req, res) => {
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
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  if (String(listing.owner) !== String(req.user._id))
    return res.status(403).json({ message: "Not allowed" });

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
};

export const deleteListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  if (String(listing.owner) !== String(req.user._id))
    return res.status(403).json({ message: "Not allowed" });

  listing.images.forEach((imgPath) => {
    const fullPath = path.join(process.cwd(), imgPath);
    fs.unlink(fullPath, (err) => {
      if (err) console.error(err);
    });
  });
  await listing.deleteOne();
  res.json({ message: "Listing deleted" });
};
