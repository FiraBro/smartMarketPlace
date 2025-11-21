import ProductView from "../models/ProductView.js";
import Product from "../models/Listing.js";
import Order from "../models/Order.js";
import AppError from "../utils/AppError.js";

/**
 * Track a product view
 */
export const trackViewService = async (productId) => {
  let view = await ProductView.findOne({ product: productId });
  if (!view) {
    view = new ProductView({ product: productId, views: 1 });
  } else {
    view.views += 1;
  }
  await view.save();
  return view;
};

/**
 * Get popular products by view count
 */
export const getPopularProductsService = async (limit = 12) => {
  const popular = await ProductView.aggregate([
    {
      $lookup: {
        from: "listings",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    { $match: { "product._id": { $exists: true } } },
    { $sort: { views: -1 } },
    { $limit: limit },
  ]);

  return popular.map((p) => p.product);
};

/**
 * Get top selling products
 */
export const getTopSellingProductsService = async (limit = 5) => {
  const topSelling = await Order.aggregate([
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.product",
        totalSold: { $sum: "$products.quantity" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "listings",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    { $match: { "product._id": { $exists: true } } },
    { $project: { totalSold: 1, product: 1 } },
  ]);

  return topSelling;
};

/**
 * Get newly added products
 */
export const getNewProductsService = async (limit = 10) => {
  return await Product.find().sort({ createdAt: -1 }).limit(limit);
};
