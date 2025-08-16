import ProductView from "../models/ProductView.js";
import Product from "../models/Listing.js";
import Order from "../models/Order.js";
import catchAsync from "../utils/catchAsync.js";

// Track a single product view
export const trackView = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  let view = await ProductView.findOne({ product: productId });
  if (!view) {
    view = new ProductView({ product: productId, views: 1 });
  } else {
    view.views += 1;
  }
  await view.save();

  res.json(view);
});

// Get popular products
export const getPopularProducts = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 12;

  const popular = await ProductView.aggregate([
    {
      $lookup: {
        from: "listings", // must match your MongoDB collection name
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: {
        path: "$product",
        preserveNullAndEmptyArrays: false, // only include if listing exists
      },
    },
    { $sort: { views: -1 } },
    { $limit: limit },
  ]);

  res.json(popular);
});

// Get top selling products
export const getTopSellingProducts = catchAsync(async (req, res, next) => {
  const topSelling = await Order.aggregate([
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.product",
        totalSold: { $sum: "$products.quantity" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "listings", // must match your MongoDB collection name
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        totalSold: 1,
        product: 1,
      },
    },
  ]);

  res.json(topSelling);
});

// Get newly added products
export const getNewProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find().sort({ createdAt: -1 }).limit(10);
  res.json(products);
});
