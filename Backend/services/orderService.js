import Order from "../models/Order.js";
import Listing from "../models/Listing.js";
import Cart from "../models/Cart.js";
import { Wallet } from "../models/Wallet.js";
import AppError from "../utils/AppError.js";
import cloudinary from "../utils/cloudinary.js";

// ----------------------------
// Helper
// ----------------------------
export const getSessionUser = (req) => req.session.user;

// ----------------------------
// Create Order
// ----------------------------
export const createOrderService = async (
  sessionUser,
  products,
  address,
  deliveryMethod,
) => {
  if (!sessionUser) throw new AppError("Not authorized", 401);

  if (!["standard", "express", "delivery", "pickup"].includes(deliveryMethod))
    throw new AppError("Invalid delivery method", 400);

  if (deliveryMethod !== "pickup" && !address)
    throw new AppError("Delivery address is required", 400);

  let orderProducts = [];

  if (products?.length) {
    orderProducts = await Promise.all(
      products.map(async (p) => {
        const listing = await Listing.findById(p.productId);
        if (!listing) throw new AppError("Invalid product ID", 400);
        if (listing.owner.toString() === sessionUser._id.toString())
          throw new AppError("You cannot order your own product", 400);

        return {
          productId: listing._id,
          sellerId: listing.owner,
          quantity: p.quantity,
          price: listing.price,
          status: "pending",
        };
      }),
    );
  } else {
    const cart = await Cart.findOne({ user: sessionUser._id });
    if (!cart || cart.items.length === 0)
      throw new AppError("Cart is empty", 400);

    orderProducts = await Promise.all(
      cart.items.map(async (item) => {
        const listing = await Listing.findById(item.listing);
        if (!listing) throw new AppError("Invalid product in cart", 400);
        if (listing.owner.toString() === sessionUser._id.toString())
          throw new AppError("You cannot order your own product", 400);

        return {
          productId: listing._id,
          sellerId: listing.owner,
          quantity: item.quantity,
          price: listing.price,
          status: "pending",
        };
      }),
    );

    cart.items = [];
    await cart.save();
  }

  const totalPrice = orderProducts.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0,
  );

  const order = new Order({
    buyerId: sessionUser._id,
    products: orderProducts,
    address: deliveryMethod !== "pickup" ? address : null,
    deliveryMethod,
    totalPrice,
    paymentStatus: "Pending",
    isPaid: false,
  });

  return await order.save();
};

// ----------------------------
// Upload Payment Proof
// ----------------------------
export const uploadPaymentProofService = async (
  sessionUser,
  orderId,
  productId,
  file,
  transactionId,
) => {
  if (!sessionUser) throw new AppError("Not authorized", 401);
  if (!file) throw new AppError("No file uploaded", 400);

  const result = await cloudinary.uploader.upload(file.path, {
    folder: "smartmarketplace/payments",
  });

  const order = await Order.findById(orderId);
  if (!order) throw new AppError("Order not found", 404);

  const product = order.products.find((p) => String(p.productId) === productId);
  if (!product) throw new AppError("Product not found in order", 404);
  if (String(order.buyerId) !== String(sessionUser._id))
    throw new AppError("Not authorized to pay for this product", 403);

  product.paymentProof = {
    imageUrl: result.secure_url,
    public_id: result.public_id,
    transactionId,
    uploadedAt: new Date(),
  };
  product.status = "payment_submitted";

  await order.save();
  return product;
};

// --- BUYER SERVICES ---
export const getMyOrdersService = async (userId) => {
  return await Order.find({ buyerId: userId }).populate("products.productId");
};

export const cancelOrderService = async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, buyerId: userId });
  if (!order) throw new AppError("Order not found", 404);
  if (order.paymentStatus === "Completed")
    throw new AppError("Cannot cancel a paid order", 400);

  order.paymentStatus = "Cancelled";
  await order.save();
};

export const confirmDeliveryService = async (orderId, productId, userId) => {
  const order = await Order.findOne({ _id: orderId, buyerId: userId });
  const product = order.products.find((p) => String(p.productId) === productId);

  if (product.status !== "shipped")
    throw new AppError("Product must be shipped first", 400);

  product.status = "delivered";
  await order.save();
  return product;
};

// --- SELLER SERVICES ---
export const getSellerOrdersService = async (sellerId) => {
  // Finds orders that contain at least one product belonging to this seller
  return await Order.find({ "products.sellerId": sellerId }).populate(
    "products.productId",
  );
};

export const markAsShippedService = async (orderId, productId, sellerId) => {
  const order = await Order.findById(orderId);
  const product = order.products.find((p) => String(p.productId) === productId);

  if (String(product.sellerId) !== String(sellerId))
    throw new AppError("Unauthorized", 403);
  if (product.status !== "paid")
    throw new AppError("Payment must be verified by admin first", 400);

  product.status = "shipped";
  await order.save();
  return product;
};

// --- ADMIN SERVICES ---
export const getAllOrdersService = async () => {
  return await Order.find().populate("buyerId", "name email");
};

export const verifyPaymentService = async (orderId, productId) => {
  const order = await Order.findById(orderId);
  const product = order.products.find((p) => String(p.productId) === productId);

  // Logic: Admin checks the proof, then marks as paid
  product.status = "paid";
  // If all products in order are paid, mark order as paid
  const allPaid = order.products.every(
    (p) => p.status === "paid" || p.status === "shipped",
  );
  if (allPaid) order.isPaid = true;

  await order.save();
  return product;
};

export const releaseFundsService = async (orderId, productId) => {
  const order = await Order.findById(orderId);
  const product = order.products.find((p) => String(p.productId) === productId);

  if (product.status !== "delivered")
    throw new AppError("Cannot release funds before delivery", 400);

  product.status = "completed"; // Final state: Seller gets money
  await order.save();
  return product;
};

export const getOrderByIdService = async (id) => {
  const order = await Order.findById(id).populate(
    "products.productId products.sellerId buyerId",
  );
  if (!order) throw new AppError("Order not found", 404);
  return order;
};

// --- BUYER SERVICES ---
export const disputeProductService = async (
  orderId,
  productId,
  userId,
  reason,
) => {
  const order = await Order.findOne({ _id: orderId, buyerId: userId });
  if (!order) throw new AppError("Order not found", 404);

  const product = order.products.find((p) => String(p.productId) === productId);
  if (!product) throw new AppError("Product not found", 404);

  product.status = "disputed";
  product.disputeReason = reason; // Ensure your Model has this field

  await order.save();
  return product;
};

// --- SELLER SERVICES ---
export const updateProductStatusService = async (
  orderId,
  productId,
  sellerId,
  status,
) => {
  const order = await Order.findById(orderId);
  if (!order) throw new AppError("Order not found", 404);

  const product = order.products.find((p) => String(p.productId) === productId);
  if (!product) throw new AppError("Product not found", 404);

  if (String(product.sellerId) !== String(sellerId))
    throw new AppError("Unauthorized: You do not own this product", 403);

  // Define allowed statuses for manual updates if needed
  const allowedStatuses = ["processing", "shipped"];
  if (!allowedStatuses.includes(status))
    throw new AppError("Invalid status update", 400);

  product.status = status;
  await order.save();
  return product;
};
