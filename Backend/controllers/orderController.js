import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

// ✅ Create an order (from cart or direct products)
export const createOrder = catchAsync(async (req, res, next) => {
  const { products } = req.body;

  let orderProducts = [];

  if (products && products.length > 0) {
    orderProducts = products;
  } else {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return next(new AppError("Cart is empty", 400));
    }

    orderProducts = cart.items.map((item) => ({
      product: item.listing,
      quantity: item.quantity,
    }));

    cart.items = [];
    await cart.save();
  }

  const order = new Order({
    user: req.user._id,
    products: orderProducts,
    status: "pending",
    isPaid: false,
  });

  await order.save();

  res.status(201).json(order);
});

// ✅ Get all orders (admin only)
export const getOrders = catchAsync(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("Not authorized, admin only", 403));
  }

  const orders = await Order.find().populate("products.product");
  res.json(orders);
});

// ✅ Get my orders (logged-in user)
export const getMyOrders = catchAsync(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    "products.product"
  );
  res.json(orders);
});

// ✅ Get a single order
export const getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "products.product"
  );

  if (!order) return next(new AppError("Order not found", 404));

  if (
    req.user.role !== "admin" &&
    String(order.user) !== String(req.user._id)
  ) {
    return next(new AppError("Not authorized to view this order", 403));
  }

  res.json(order);
});

// ✅ Update order status (admin only)
export const updateOrderStatus = catchAsync(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("Not authorized, admin only", 403));
  }

  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) return next(new AppError("Order not found", 404));

  order.status = status || order.status;
  await order.save();

  res.json(order);
});

// ✅ Mark order as paid
export const payOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) return next(new AppError("Order not found", 404));

  if (
    req.user.role !== "admin" &&
    String(order.user) !== String(req.user._id)
  ) {
    return next(new AppError("Not authorized to pay this order", 403));
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.status = "paid";

  await order.save();

  res.json({ message: "Order marked as paid", order });
});

// ✅ Cancel/Delete an order
export const cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) return next(new AppError("Order not found", 404));

  if (
    req.user.role !== "admin" &&
    String(order.user) !== String(req.user._id)
  ) {
    return next(new AppError("Not authorized to cancel this order", 403));
  }

  if (order.status === "shipped" || order.status === "delivered") {
    return next(new AppError("Cannot cancel after shipping", 400));
  }

  await order.deleteOne();
  res.json({ message: "Order cancelled" });
});
