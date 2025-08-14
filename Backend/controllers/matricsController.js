// controllers/metrics.controller.js
import ProductView from "../models/ProductView.js";
import Product from "../models/Listing.js";

// Track a single product view
export const trackView = async (req, res) => {
  try {
    const { productId } = req.params;
    let view = await ProductView.findOne({ product: productId });
    if (!view) {
      view = new ProductView({ product: productId, views: 1 });
    } else {
      view.views += 1;
    }
    await view.save();
    res.json(view);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get popular products
export const getPopularProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;

    // Aggregation pipeline
    const popular = await ProductView.aggregate([
      {
        $lookup: {
          from: "listings", // must match the actual MongoDB collection name
          localField: "product", // field in ProductView
          foreignField: "_id", // field in Listing
          as: "product",
        },
      },
      {
        $unwind: {
          path: "$product",
          preserveNullAndEmptyArrays: false, // only include views with valid listings
        },
      },
      { $sort: { views: -1 } }, // most viewed first
      { $limit: limit },
    ]);

    res.json(popular);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMostSoldProducts = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          totalSold: { $sum: "$products.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
    ]);
    res.json(orders.map((o) => o.product));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getNewProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(10);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
