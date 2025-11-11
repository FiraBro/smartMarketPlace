import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import {
  createSeller,
  getSeller,
  updateSeller,
  getSellerProducts,
  fetchSellerOrders,
  changeOrderStatus,
  getRecentSellerOrders,
  getSellerWallet,
} from "../services/sellerService.js";
// import { getSellerDashboard } from "../services/sellerService.js";

const getUserId = (req) => req.session.user?._id;

// ---------------------
// Seller Profile Controllers
// ---------------------

export const createSellerProfile = catchAsync(async (req, res, next) => {
  const userId = getUserId(req);
  if (!userId) return next(new AppError("Unauthorized", 401));

  const seller = await createSeller({
    userId,
    data: req.body,
    files: req.files,
  });
  res.status(201).json(seller);
});

export const getSellerProfile = catchAsync(async (req, res, next) => {
  const userId = getUserId(req);
  if (!userId) return next(new AppError("Unauthorized", 401));

  const seller = await getSeller(userId);
  res.json(seller);
});

export const updateSellerProfile = catchAsync(async (req, res, next) => {
  const userId = getUserId(req);
  if (!userId) return next(new AppError("Unauthorized", 401));

  const seller = await updateSeller({
    userId,
    data: req.body,
    files: req.files,
  });
  res.json(seller);
});

// ---------------------
// Seller Products Controllers
// ---------------------

export const getSellerProductsControllers = catchAsync(
  async (req, res, next) => {
    const userId = getUserId(req);
    if (!userId) return next(new AppError("Unauthorized", 401));

    const products = await getSellerProducts(userId);
    res.json(products);
  }
);

// ---------------------
// Seller Orders Controllers
// ---------------------

export const getSellerOrdersControllers = catchAsync(async (req, res, next) => {
  const sellerId = getUserId(req);
  if (!sellerId) return next(new AppError("Unauthorized", 401));

  const orders = await fetchSellerOrders(sellerId);
  res.json({ orders });
});

export const updateOrderStatusControllers = catchAsync(
  async (req, res, next) => {
    const sellerId = getUserId(req);
    const { id } = req.params;
    const { status } = req.body;

    const order = await changeOrderStatus(id, sellerId, status);
    res.json(order);
  }
);
export const getRecentSellerOrdersControllers = catchAsync(
  async (req, res, next) => {
    const sellerId = getUserId(req);
    const recentOrders = await getRecentSellerOrders(sellerId, 5);

    res.status(200).json({
      success: true,
      results: recentOrders.length,
      data: recentOrders,
    });
  }
);

/**
 * Controller to handle seller dashboard
 */
export const getSellerDashboardController = catchAsync(
  async (req, res, next) => {
    const sellerId = getUserId(req);
    if (!sellerId) return next(new AppError("Unauthorized", 401));

    const walletData = await getSellerWallet(sellerId);

    res.status(200).json({
      success: true,
      wallet: walletData,
    });
  }
);
