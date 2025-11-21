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
  deliveryMethod
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
      })
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
      })
    );

    cart.items = [];
    await cart.save();
  }

  const totalPrice = orderProducts.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
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
  transactionId
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
