import Admin from "../models/Admin.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import Seller from "../models/Seller.js";
import Listing from "../models/Listing.js";
import Order from "../models/Order.js";
import { Wallet } from "../models/Wallet.js";

/**
 * ============================
 * ADMIN AUTH CONTROLLERS
 * ============================
 */

// ✅ Register admin
export const registerAdmin = catchAsync(async (req, res, next) => {
  const { email, password, passwordConfirm, role } = req.body;

  if (password !== passwordConfirm) {
    return next(new AppError("Passwords do not match", 400));
  }

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return next(new AppError("Admin with this email already exists", 400));
  }

  const newAdmin = await Admin.create({
    email,
    password,
    role: role || "admin",
  });

  newAdmin.password = undefined;

  res.status(201).json({
    status: "success",
    message: "Admin registered successfully",
    data: { admin: newAdmin },
  });
});

// ✅ Login admin (unified session)
export const loginAdmin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin || !(await admin.correctPassword(password, admin.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  if (!admin.isActive) {
    return next(new AppError("Your account has been deactivated", 401));
  }

  // ✅ Unified session — all user types stored under req.session.user
  req.session.user = {
    id: admin._id,
    name: admin.username || "Admin",
    email: admin.email,
    role: admin.role || "admin",
  };

  admin.password = undefined;

  res.status(200).json({
    status: "success",
    message: "Admin logged in successfully",
    data: { user: req.session.user },
  });
});

// ✅ Logout (same for all)
export const logoutAdmin = catchAsync(async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(new AppError("Could not log out", 500));

    res.clearCookie("connect.sid");
    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  });
});

// ✅ Get current admin info
export const getMeAdmin = catchAsync(async (req, res, next) => {
  console.log("Session in getMeAdmin:", req.session);

  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(401).json({
      status: "fail",
      message: "Not authorized — admin only",
    });
  }

  res.status(200).json({
    status: "success",
    data: { user: req.session.user },
  });
});

/**
 * ============================
 * ADMIN ACTIONS
 * ============================
 */

// ✅ Approve Seller
export const approveSeller = catchAsync(async (req, res, next) => {
  const { sellerId } = req.params;

  const seller = await Seller.findById(sellerId);
  if (!seller) return next(new AppError("Seller not found", 404));

  seller.status = "approved";
  await seller.save();

  res.status(200).json({
    status: "success",
    message: "Seller approved successfully",
    data: seller,
  });
});

// ✅ Suspend Seller
export const suspendSeller = catchAsync(async (req, res, next) => {
  const { sellerId } = req.params;

  const seller = await Seller.findById(sellerId);
  if (!seller) return next(new AppError("Seller not found", 404));

  seller.status = "suspended";
  await seller.save();

  res.status(200).json({
    status: "success",
    message: "Seller suspended successfully",
    data: seller,
  });
});

// ✅ Get listing details with latest order
export const getListingDetails = catchAsync(async (req, res, next) => {
  const listings = await Listing.find()
    .populate({
      path: "owner",
      select: "_id",
      populate: {
        path: "seller",
        model: "Seller",
        select: "shopName status",
      },
    })
    .select("title category stock");

  const result = await Promise.all(
    listings.map(async (listing) => {
      const order = await Order.findOne({ "products.product": listing._id })
        .sort({ orderDate: -1 })
        .select("_id amount orderDate status")
        .lean();

      return {
        productTitle: listing.title,
        category: listing.category,
        stock: listing.stock || 0,
        sellerName: listing.owner?.seller?.shopName || "Unknown",
        sellerStatus: listing.owner?.seller?.status || "pending",
        orderId: order?._id || null,
        orderAmount: order?.amount || 0,
        orderDate: order?.orderDate || null,
        orderStatus: order?.status || "N/A",
      };
    })
  );

  res.status(200).json({ status: "success", data: result });
});

// ✅ Verify buyer payment (hold funds in escrow)
export const verifyPayment = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("Order not found", 404));

  order.status = "funds_held";
  await order.save();

  await Wallet.findOneAndUpdate(
    { userId: order.sellerId },
    { $inc: { escrowHeld: order.totalAmount } },
    { upsert: true }
  );

  res.status(200).json({
    status: "success",
    message: "Funds held in escrow",
    data: { order },
  });
});

// ✅ Release funds to seller
export const releaseFunds = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order || order.status !== "completed") {
    return next(new AppError("Order not ready for release", 400));
  }

  await Wallet.findOneAndUpdate(
    { userId: order.sellerId },
    { $inc: { balance: order.totalAmount, escrowHeld: -order.totalAmount } }
  );

  res.status(200).json({
    status: "success",
    message: "Funds released to seller",
    data: { order },
  });
});
