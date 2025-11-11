// services/sellerService.js
import Seller from "../models/Seller.js";
import Listing from "../models/Listing.js";
import Order from "../models/Order.js";
import { Wallet } from "../models/Wallet.js";

// ---------------------
// Seller Profile Services
// ---------------------

export const createSeller = async ({ userId, data, files }) => {
  const exists = await Seller.findOne({ user: userId });
  if (exists) throw new Error("Seller profile already exists");

  const seller = await Seller.create({
    user: userId,
    shopName: data.shopName,
    description: data.description,
    contact: data.contact,
    bankAccount: data.bankAccount,
    payoutMethod: data.payoutMethod,
    address: data.address,
    logo: files?.logo ? `/uploads/${files.logo[0].filename}` : "",
    banner: files?.banner ? `/uploads/${files.banner[0].filename}` : "",
  });

  return seller;
};

export const getSeller = async (userId) => {
  const seller = await Seller.findOne({ user: userId }).lean();
  if (!seller) throw new Error("Seller profile not found");
  return seller;
};

export const updateSeller = async ({ userId, data, files }) => {
  console.log(`user ID:${userId}`);

  const updates = { ...data };

  if (files?.logo) updates.logo = `/uploads/${files.logo[0].filename}`;
  if (files?.banner) updates.banner = `/uploads/${files.banner[0].filename}`;

  let seller = await Seller.findOne({ user: userId });

  if (!seller) {
    // Create new seller if doesn't exist
    seller = await Seller.create({
      user: userId,
      ...updates,
    });
    return seller;
  }

  // If exists, update it
  Object.assign(seller, updates);
  await seller.save();
  return seller;
};

// ---------------------
// Seller Products Services
// ---------------------

export const getSellerProducts = async (userId) => {
  const products = await Listing.find({ owner: userId })
    .sort("-createdAt")
    .lean();
  return products;
};

// ---------------------
// Seller Orders Services
// ---------------------

export const fetchSellerOrders = async (sellerId) => {
  const orders = await Order.find({ "products.seller": sellerId })
    .populate("user", "name email")
    .populate({ path: "products.product", select: "title price images" })
    .sort("-createdAt")
    .lean();

  orders.forEach((order) => {
    if (!order.user) order.user = { name: "Unknown Buyer", email: "N/A" };
  });

  return orders;
};

export const changeOrderStatus = async (orderId, sellerId, status) => {
  const order = await Order.findOne({
    _id: orderId,
    "products.seller": sellerId,
  });
  if (!order) throw new Error("Order not found");

  order.products = order.products.map((p) => {
    if (String(p.seller) === String(sellerId)) p.status = status;
    return p;
  });

  await order.save();
  return order;
};
export const getRecentSellerOrders = async (sellerId, limit = 5) => {
  const orders = await Order.find({ "products.seller": sellerId })
    .populate("user", "name email")
    .populate({ path: "products.product", select: "title price images" })
    .sort("-createdAt") // sort by newest first
    .limit(limit) // get only the most recent
    .lean();

  // Ensure user info exists
  orders.forEach((order) => {
    if (!order.user) order.user = { name: "Unknown Buyer", email: "N/A" };
  });

  return orders;
};
// services/sellerService.js

export const getSellerWallet = async (userId) => {
  if (!userId) throw new Error("User ID is required");

  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    // Return default wallet if none exists
    return {
      balance: 0,
      escrowHeld: 0,
      cardNumber: "N/A",
      cardHolder: "Seller Wallet",
    };
  }

  return {
    balance: wallet.balance,
    escrowHeld: wallet.escrowHeld,
    cardNumber: "5432123456789876", // you can customize if needed
    cardHolder: "Seller Wallet",
  };
};
