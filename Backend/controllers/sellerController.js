import Seller from "../models/seller.js";
import Listing from "../models/Listing.js";
import Order from "../models/Order.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

// ✅ Helper to get logged-in user ID safely
const getUserId = (req) => {
  if (!req.session || !req.session.user) {
    throw new AppError("Not authorized", 401);
  }
  return req.session.user._id;
};

// ---------------------
// Seller Profile
// ---------------------

// Create Seller Profile
export const createSellerProfile = catchAsync(async (req, res, next) => {
  const userId = getUserId(req);

  const exists = await Seller.findOne({ user: userId });
  if (exists) return next(new AppError("Seller profile already exists", 400));

  const { shopName, description, contact, bankAccount, payoutMethod, address } =
    req.body;

  // Read banner and logo if uploaded
  const logo = req.files?.logo ? `/uploads/${req.files.logo[0].filename}` : "";
  const banner = req.files?.banner
    ? `/uploads/${req.files.banner[0].filename}`
    : "";

  const seller = await Seller.create({
    user: userId,
    shopName,
    description,
    contact,
    bankAccount,
    payoutMethod,
    address,
    logo,
    banner,
  });

  res.status(201).json(seller);
});

// Get Seller Profile
export const getSellerProfile = catchAsync(async (req, res, next) => {
  const userId = getUserId(req);

  const seller = await Seller.findOne({ user: userId }).lean();
  if (!seller) return next(new AppError("Seller profile not found", 404));
  res.json(seller);
});

// Update Seller Profile
export const updateSellerProfile = catchAsync(async (req, res, next) => {
  const userId = getUserId(req);

  const updates = { ...req.body };

  // Handle uploaded files
  if (req.files?.logo) updates.logo = `/uploads/${req.files.logo[0].filename}`;
  if (req.files?.banner)
    updates.banner = `/uploads/${req.files.banner[0].filename}`;

  const seller = await Seller.findOneAndUpdate({ user: userId }, updates, {
    new: true,
  });

  if (!seller) return next(new AppError("Seller profile not found", 404));

  res.json(seller);
});

// ---------------------
// Seller Products
// ---------------------
export const getSellerProducts = catchAsync(async (req, res, next) => {
  const userId = getUserId(req);

  const products = await Listing.find({ owner: userId })
    .sort("-createdAt")
    .lean();
  res.json(products);
});

// ---------------------
// Seller Orders
// ---------------------
export const getSellerOrders = catchAsync(async (req, res, next) => {
  const userId = getUserId(req);

  const orders = await Order.find({ "products.seller": userId })
    .populate("user", "name email") // buyer info
    .populate("products.product", "title price images")
    .sort("-createdAt")
    .lean();

  res.json({ orders });
});

// Update Order Status
export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const userId = getUserId(req);
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findOne({ _id: id, "products.seller": userId });
  if (!order) return next(new AppError("Order not found", 404));

  // Update status for all products of this seller in the order
  order.products = order.products.map((p) => {
    if (String(p.seller) === String(userId)) p.status = status;
    return p;
  });

  await order.save();
  res.json(order);
});
