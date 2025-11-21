import Seller from "../models/Seller.js";
import Order from "../models/Order.js";
import { Wallet } from "../models/Wallet.js";
import AppError from "../utils/AppError.js";

/**
 * ✅ Approve a seller
 */
export const approveSellerService = async (sellerId) => {
  const seller = await Seller.findById(sellerId);
  if (!seller) throw new AppError("Seller not found", 404);

  seller.status = "approved";
  await seller.save();

  return seller;
};

/**
 * ✅ Suspend a seller
 */
export const suspendSellerService = async (sellerId) => {
  const seller = await Seller.findById(sellerId);
  if (!seller) throw new AppError("Seller not found", 404);

  seller.status = "suspended";
  await seller.save();

  return seller;
};

/**
 * ✅ Verify buyer payment (hold funds in escrow)
 */
export const verifyPaymentService = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new AppError("Order not found", 404);

  order.status = "funds_held";
  await order.save();

  await Wallet.findOneAndUpdate(
    { userId: order.sellerId },
    { $inc: { escrowHeld: order.totalAmount } },
    { upsert: true }
  );

  return order;
};

/**
 * ✅ Release funds to seller
 */
export const releaseFundsService = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order || order.status !== "completed") {
    throw new AppError("Order not ready for release", 400);
  }

  await Wallet.findOneAndUpdate(
    { userId: order.sellerId },
    { $inc: { balance: order.totalAmount, escrowHeld: -order.totalAmount } }
  );

  return order;
};
