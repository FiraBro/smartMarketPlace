import Listing from "../models/Listing.js";
import ProductView from "../models/ProductView.js";
import Order from "../models/Order.js";
import Newsletter from "../models/NewsLetter.js";
import { sendEmail } from "../utils/sendEmail.js";
import cloudinary from "../utils/cloudinary.js";
import AppError from "../utils/AppError.js";

/**
 * Build MongoDB query for listing search/filter
 */
export const buildQuery = ({
  q,
  category,
  minPrice,
  maxPrice,
  owner,
  condition,
}) => {
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

/**
 * List listings with pagination and sorting
 */
export const listListingsService = async (queryParams) => {
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
  } = queryParams;

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

  return {
    page: pageNum,
    limit: pageSize,
    total,
    totalPages: Math.ceil(total / pageSize) || 1,
    hasNextPage: skip + items.length < total,
    items,
  };
};

/**
 * Get listing by ID and increment view count
 */
export const getListingByIdService = async (id) => {
  const listing = await Listing.findById(id).lean();
  if (!listing) throw new AppError("Listing not found", 404);

  let view = await ProductView.findOne({ product: id });
  if (!view) view = new ProductView({ product: id, views: 1 });
  else view.views += 1;
  await view.save();

  const related = await Listing.find({
    category: listing.category,
    _id: { $ne: listing._id },
  })
    .limit(4)
    .lean();

  return { listing, related };
};

/**
 * Create listing with images and notify newsletter subscribers
 */
export const createListingService = async (userId, data, files) => {
  const {
    title,
    description,
    price,
    category,
    condition,
    location,
    stock,
    sizes,
  } = data;
  if (!title || !description || !price || !location)
    throw new AppError(
      "title, description, price, and location are required",
      400
    );

  const images = (files || []).map((f) => ({
    url: f.path || f.location,
    public_id: f.filename || f.public_id,
  }));

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
    owner: userId,
  });

  const subscribers = await Newsletter.find({});
  for (const subscriber of subscribers) {
    await sendEmail({
      to: subscriber.email,
      subject: `New Product Added: ${listing.title}`,
      html: `<h2>New Product Alert!</h2><p><strong>${listing.title}</strong></p><p>${listing.description}</p><p>Price: $${listing.price}</p><a href="${process.env.FRONTEND_URL}/listings/${listing._id}" style="color: #F9A03F;">View Product</a>`,
    });
  }

  return listing;
};

/**
 * Update listing
 */
export const updateListingService = async (userId, id, data, files) => {
  const listing = await Listing.findById(id);
  if (!listing) throw new AppError("Listing not found", 404);
  if (String(listing.owner) !== String(userId))
    throw new AppError("Not allowed", 403);

  // Delete old images from Cloudinary
  if (listing.images?.length) {
    for (const img of listing.images) {
      if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
    }
  }

  const newImages = (files || []).map((f) => ({
    url: f.path || f.location,
    public_id: f.filename || f.public_id,
  }));

  Object.assign(listing, { ...data, images: newImages });
  return await listing.save();
};

/**
 * Delete listing
 */
export const deleteListingService = async (userId, id) => {
  const listing = await Listing.findById(id);
  if (!listing) throw new AppError("Listing not found", 404);
  if (String(listing.owner) !== String(userId))
    throw new AppError("Not allowed", 403);

  if (listing.images?.length) {
    for (const img of listing.images) {
      if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
    }
  }

  await listing.deleteOne();
};

/**
 * Get distinct categories
 */
export const getCategoriesService = async () => {
  return await Listing.distinct("category");
};

/**
 * Get listings with latest order info
 */
export const getListingDetailsService = async () => {
  const listings = await Listing.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerInfo",
      },
    },
    { $unwind: "$ownerInfo" },
    {
      $lookup: {
        from: "sellers",
        let: { ownerId: "$ownerInfo._id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$user", "$$ownerId"] } } },
          { $project: { shopName: 1, status: 1 } },
        ],
        as: "sellerInfo",
      },
    },
    { $unwind: { path: "$sellerInfo", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        title: 1,
        category: 1,
        stock: 1,
        sellerName: "$sellerInfo.shopName",
        sellerStatus: "$sellerInfo.status",
      },
    },
  ]);

  return await Promise.all(
    listings.map(async (listing) => {
      const order = await Order.findOne({ "products.product": listing._id })
        .sort({ orderDate: -1 })
        .select("_id amount orderDate status")
        .lean();

      return {
        productTitle: listing.title,
        category: listing.category,
        stock: listing.stock || 0,
        sellerName: listing.sellerName || "Unknown",
        sellerStatus: listing.sellerStatus || "pending",
        orderId: order?._id || null,
        orderAmount: order?.amount || 0,
        orderDate: order?.orderDate || null,
        orderStatus: order?.status || "N/A",
      };
    })
  );
};
