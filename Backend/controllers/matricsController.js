import catchAsync from "../utils/catchAsync.js";
import * as productService from "../services/matricService.js";

// Track a single product view
export const trackView = catchAsync(async (req, res) => {
  const view = await productService.trackViewService(req.params.productId);
  res.json(view);
});

// Get popular products
export const getPopularProducts = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 12;
  const products = await productService.getPopularProductsService(limit);

  res.json({
    page: 1,
    limit,
    total: products.length,
    totalPages: 1,
    hasNextPage: false,
    items: products,
  });
});

// Get top selling products
export const getTopSellingProducts = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const topSelling = await productService.getTopSellingProductsService(limit);
  res.json(topSelling);
});

// Get newly added products
export const getNewProducts = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const products = await productService.getNewProductsService(limit);
  res.json(products);
});
