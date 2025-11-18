import Admin from "../models/Admin.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import Seller from "../models/Seller.js";
import Listing from "../models/Listing.js";
import Order from "../models/Order.js";
import { Wallet } from "../models/Wallet.js";

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
