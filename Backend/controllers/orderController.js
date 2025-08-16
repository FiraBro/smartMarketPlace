import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

// Create an order from cart or directly from products
export const createOrder = catchAsync(async (req, res, next) => {
  const { products } = req.body; // optional: [{ product: listingId, quantity }]

  let orderProducts = [];

  if (products && products.length > 0) {
    // Use products from request body
    orderProducts = products;
  } else {
    // Use products from user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return next(new AppError("Cart is empty", 400));
    }

    orderProducts = cart.items.map((item) => ({
      product: item.listing,
      quantity: item.quantity,
    }));

    // Clear cart after creating order
    cart.items = [];
    await cart.save();
  }

  const order = new Order({
    user: req.user._id, // 🔑 track which user placed the order
    products: orderProducts,
  });

  await order.save();

  res.status(201).json(order);
});

// Get all orders (admin sees all, user sees own)
export const getOrders = catchAsync(async (req, res, next) => {
  const filter = req.user.role === "admin" ? {} : { user: req.user._id };

  const orders = await Order.find(filter).populate("products.product");

  res.json(orders);
});

// Get a single order by ID
export const getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "products.product"
  );

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // 🔐 Prevent normal users from accessing other users' orders
  if (
    req.user.role !== "admin" &&
    String(order.user) !== String(req.user._id)
  ) {
    return next(new AppError("Not authorized to view this order", 403));
  }

  res.json(order);
});
