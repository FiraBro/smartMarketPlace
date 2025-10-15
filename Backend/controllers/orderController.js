import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Listing from "../models/Listing.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

// ✅ Create an order (session-based)
export const createOrder = catchAsync(async (req, res, next) => {
  const sessionUser = req.session.user;
  if (!sessionUser) {
    return next(new AppError("Not authorized. Please login.", 401));
  }

  const { products, address, paymentMethod, totalPrice, deliveryMethod } =
    req.body;

  if (!["delivery", "pickup"].includes(deliveryMethod)) {
    return next(new AppError("Invalid delivery method", 400));
  }

  if (deliveryMethod === "delivery" && !address) {
    return next(new AppError("Delivery address is required", 400));
  }

  if (!totalPrice) return next(new AppError("Total price is required", 400));

  let orderProducts = [];

  if (products?.length) {
    // Map products and add seller reference
    orderProducts = await Promise.all(
      products.map(async (p) => {
        const listing = await Listing.findById(p.product);
        if (!listing) throw new AppError("Invalid product ID", 400);
        return {
          product: listing._id,
          seller: listing.owner,
          quantity: p.quantity,
          status: "pending",
        };
      })
    );
  } else {
    // Get items from session-based cart
    const cart = await Cart.findOne({ user: sessionUser._id });
    if (!cart || cart.items.length === 0)
      return next(new AppError("Cart is empty", 400));

    orderProducts = await Promise.all(
      cart.items.map(async (item) => {
        const listing = await Listing.findById(item.listing);
        if (!listing) throw new AppError("Invalid product ID in cart", 400);
        return {
          product: listing._id,
          seller: listing.owner,
          quantity: item.quantity,
          status: "pending",
        };
      })
    );

    cart.items = [];
    await cart.save();
  }

  const order = new Order({
    user: sessionUser._id, // ✅ use session user
    products: orderProducts,
    address: deliveryMethod === "delivery" ? address : null,
    totalPrice,
    paymentMethod,
    deliveryMethod,
    status: "pending",
    isPaid: false,
  });

  await order.save();
  res.status(201).json(order);
});

// ✅ Get all orders (admin only)
export const getOrders = catchAsync(async (req, res, next) => {
  const sessionUser = req.session.user;
  if (!sessionUser || sessionUser.role !== "admin")
    return next(new AppError("Not authorized, admin only", 403));

  const orders = await Order.find()
    .populate("products.product")
    .populate("user", "name email");

  res.json(orders);
});

// ✅ Get my orders (buyer)
export const getMyOrders = catchAsync(async (req, res) => {
  const sessionUser = req.session.user;
  if (!sessionUser) return next(new AppError("Not authorized", 401));

  const orders = await Order.find({ user: sessionUser._id }).populate(
    "products.product"
  );
  res.json(orders);
});

// ✅ Get single order
export const getOrderById = catchAsync(async (req, res, next) => {
  const sessionUser = req.session.user;
  if (!sessionUser) return next(new AppError("Not authorized", 401));

  const order = await Order.findById(req.params.id).populate(
    "products.product"
  );
  if (!order) return next(new AppError("Order not found", 404));

  if (
    sessionUser.role !== "admin" &&
    String(order.user) !== String(sessionUser._id)
  ) {
    return next(new AppError("Not authorized to view this order", 403));
  }

  res.json(order);
});

// ✅ Update order status (admin only)
export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const sessionUser = req.session.user;
  if (!sessionUser || sessionUser.role !== "admin")
    return next(new AppError("Not authorized, admin only", 403));

  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("Order not found", 404));

  order.status = status || order.status;
  await order.save();
  res.json(order);
});

// ✅ Pay order
export const payOrder = catchAsync(async (req, res, next) => {
  const sessionUser = req.session.user;
  if (!sessionUser) return next(new AppError("Not authorized", 401));

  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("Order not found", 404));

  if (
    sessionUser.role !== "admin" &&
    String(order.user) !== String(sessionUser._id)
  ) {
    return next(new AppError("Not authorized to pay this order", 403));
  }

  const { paymentMethod, phone } = req.body;
  if (!["COD", "TeleBirr", "Chapa"].includes(paymentMethod)) {
    return next(new AppError("Invalid payment method", 400));
  }

  if (paymentMethod === "COD") {
    order.paymentMethod = "COD";
    order.isPaid = false;
    order.status = "paid";
    await order.save();
    return res.json({ message: "Cash on Delivery selected", order });
  }

  if (paymentMethod === "TeleBirr" || paymentMethod === "Chapa") {
    if (!phone) return next(new AppError("Phone number required", 400));
    order.paymentMethod = paymentMethod;
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = "paid";
    await order.save();

    const paymentUrl =
      paymentMethod === "TeleBirr"
        ? `https://telebirr.et/pay/${order._id}`
        : `https://chapa.com/pay/${order._id}`;

    return res.json({
      message: `${paymentMethod} payment initiated`,
      paymentUrl,
      order,
    });
  }
});

// ✅ Cancel order
export const cancelOrder = catchAsync(async (req, res, next) => {
  const sessionUser = req.session.user;
  if (!sessionUser) return next(new AppError("Not authorized", 401));

  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("Order not found", 404));

  if (
    sessionUser.role !== "admin" &&
    String(order.user) !== String(sessionUser._id)
  ) {
    return next(new AppError("Not authorized to cancel this order", 403));
  }

  if (order.status === "shipped" || order.status === "delivered") {
    return next(new AppError("Cannot cancel after shipping", 400));
  }

  await order.deleteOne();
  res.json({ message: "Order cancelled" });
});

// ✅ Seller: Get orders for this seller
export const getSellerOrders = catchAsync(async (req, res, next) => {
  const sessionUser = req.session.user;
  if (!sessionUser || sessionUser.role !== "seller")
    return next(new AppError("Not authorized, sellers only", 403));

  const orders = await Order.find({ "products.seller": sessionUser._id })
    .populate("user", "name email")
    .populate("products.product", "title price images")
    .lean();

  res.json(orders);
});

// ✅ Seller: Update status of seller products
export const updateSellerOrderStatus = catchAsync(async (req, res, next) => {
  const sessionUser = req.session.user;
  if (!sessionUser || sessionUser.role !== "seller")
    return next(new AppError("Not authorized, sellers only", 403));

  const { orderId, status } = req.body;
  const order = await Order.findOne({
    _id: orderId,
    "products.seller": sessionUser._id,
  });
  if (!order) return next(new AppError("Order not found", 404));

  order.products = order.products.map((p) => {
    if (String(p.seller) === String(sessionUser._id)) p.status = status;
    return p;
  });

  await order.save();
  res.json(order);
});
