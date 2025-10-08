import Seller from "../models/Seller.js";
import Listing from "../models/Listing.js";
import Order from "../models/Order.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

// ✅ Seller Profile
export const createSellerProfile = catchAsync(async (req, res, next) => {
  const exists = await Seller.findOne({ user: req.user._id });
  if (exists) return next(new AppError("Seller profile already exists", 400));

  const { shopName, description, contact, bankAccount, payoutMethod } =
    req.body;

  const seller = await Seller.create({
    user: req.user._id,
    shopName,
    description,
    contact,
    bankAccount,
    payoutMethod,
  });

  res.status(201).json(seller);
});

export const getSellerProfile = catchAsync(async (req, res, next) => {
  const seller = await Seller.findOne({ user: req.user._id }).lean();
  if (!seller) return next(new AppError("Seller profile not found", 404));
  res.json(seller);
});

export const updateSellerProfile = catchAsync(async (req, res, next) => {
  const updates = req.body;
  const seller = await Seller.findOneAndUpdate(
    { user: req.user._id },
    updates,
    { new: true }
  );
  if (!seller) return next(new AppError("Seller profile not found", 404));
  res.json(seller);
});

// ✅ Seller Products
export const getSellerProducts = catchAsync(async (req, res, next) => {
  const products = await Listing.find({ owner: req.user._id })
    .sort("-createdAt")
    .lean();
  res.json(products);
});

// ✅ Seller Orders
export const getSellerOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ "products.seller": req.user._id })
    .populate("buyer", "name email")
    .populate("products.listing", "title price images")
    .sort("-createdAt")
    .lean();
  res.json(orders);
});

export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await Order.findOne({
    _id: id,
    "products.seller": req.user._id,
  });
  if (!order) return next(new AppError("Order not found", 404));

  // Update status for all products of this seller in the order
  order.products = order.products.map((p) => {
    if (String(p.seller) === String(req.user._id)) p.status = status;
    return p;
  });

  await order.save();
  res.json(order);
});
