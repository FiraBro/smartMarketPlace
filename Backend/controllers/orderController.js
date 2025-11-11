import Order from "../models/Order.js";
import Listing from "../models/Listing.js";
import Cart from "../models/Cart.js";
import { Wallet } from "../models/Wallet.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

// ✅ Create Order (Multi-seller compatible)
export const createOrder = catchAsync(async (req, res, next) => {
  const sessionUser = req.session.user;
  if (!sessionUser) return next(new AppError("Not authorized", 401));

  const { products, address, deliveryMethod } = req.body;

  // Allow standard, express, delivery, or pickup
  if (!["standard", "express", "delivery", "pickup"].includes(deliveryMethod))
    return next(new AppError("Invalid delivery method", 400));

  // Require address only if not pickup
  if (deliveryMethod !== "pickup" && !address)
    return next(new AppError("Delivery address is required", 400));

  let orderProducts = [];

  if (products?.length) {
    orderProducts = await Promise.all(
      products.map(async (p) => {
        const listing = await Listing.findById(p.productId);
        if (!listing) throw new AppError("Invalid product ID", 400);

        // ✅ Prevent buyer from ordering their own product
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
      return next(new AppError("Cart is empty", 400));

    orderProducts = await Promise.all(
      cart.items.map(async (item) => {
        const listing = await Listing.findById(item.listing);
        if (!listing) throw new AppError("Invalid product in cart", 400);

        // ✅ Prevent self-order from cart as well
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

  await order.save();
  res.status(201).json(order);
});

// ✅ Buyer uploads payment proof for a specific product
export const uploadPaymentProof = catchAsync(async (req, res, next) => {
  const sessionUser = req.session.user;
  if (!sessionUser) return next(new AppError("Not authorized", 401));

  const { orderId, productId } = req.params;
  const { transactionId } = req.body;
  const proofUrl = `/uploads/${req.file.filename}`;

  const order = await Order.findById(orderId);
  if (!order) return next(new AppError("Order not found", 404));

  const product = order.products.find((p) => String(p.productId) === productId);
  if (!product) return next(new AppError("Product not found in order", 404));

  if (String(order.buyerId) !== String(sessionUser._id))
    return next(new AppError("Not authorized to pay for this product", 403));

  product.paymentProof = {
    imageUrl: proofUrl,
    transactionId,
    uploadedAt: new Date(),
  };
  product.status = "payment_submitted";

  await order.save();
  res.json({ message: "Payment proof uploaded", product });
});

// ✅ Admin: verify payment for a product and hold funds in escrow
export const verifyPayment = catchAsync(async (req, res, next) => {
  const sessionUser = req.session.user;
  if (!sessionUser || sessionUser.role !== "admin")
    return next(new AppError("Not authorized, admin only", 403));

  const { orderId, productId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) return next(new AppError("Order not found", 404));

  // ✅ Compare with nested productId._id

  // NEW
  const product = order.products.find((p) => String(p._id) === productId);
  if (!product) return next(new AppError("Product not found", 404));

  product.status = "funds_held";

  // Add funds to seller's escrow wallet
  await Wallet.findOneAndUpdate(
    { userId: product.sellerId },
    { $inc: { escrowHeld: product.price * product.quantity } },
    { upsert: true }
  );

  await order.save();
  res.json({ message: "Payment verified and funds held", product });
});

// ✅ Admin: release funds after delivery
export const releaseFunds = catchAsync(async (req, res, next) => {
  const { orderId, productId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) return next(new AppError("Order not found", 404));
  const product = order.products.find(
    (p) => String(p.productId) === productId || String(p._id) === productId
  );

  if (!product) return next(new AppError("Product not found", 404));

  if (product.status !== "completed")
    return next(new AppError("Product not delivered yet", 400));

  await Wallet.findOneAndUpdate(
    { userId: product.sellerId },
    {
      $inc: {
        balance: product.price * product.quantity,
        escrowHeld: -(product.price * product.quantity),
      },
    },
    { upsert: true }
  );

  product.status = "completed";
  await order.save();
  res.json({ message: "Funds released to seller", product });
});

// ✅ Seller: mark product as shipped

export const markAsShipped = catchAsync(async (req, res, next) => {
  const sessionUser = req.session.user;
  const { orderId, productId } = req.params;

  if (!sessionUser || sessionUser.role !== "seller")
    return next(new AppError("Not authorized", 403));

  const order = await Order.findById(orderId);
  if (!order) return next(new AppError("Order not found", 404));

  // Convert params to string for safe comparison
  const product = order.products.find(
    (p) =>
      p.productId._id.toString() === productId &&
      p.sellerId.toString() === sessionUser._id.toString()
  );

  if (!product)
    return next(new AppError("Product not found or unauthorized", 404));

  product.status = "shipped";
  await order.save();

  res.status(200).json({
    status: "success",
    message: "Product marked as shipped",
    product,
  });
});

// ✅ Buyer: confirm delivery for a product
export const confirmDelivery = catchAsync(async (req, res, next) => {
  const sessionUser = req.session.user;
  const { orderId, productId } = req.params;
  if (!sessionUser) return next(new AppError("Not authorized", 401));

  const order = await Order.findById(orderId);
  if (!order) return next(new AppError("Order not found", 404));

  const product = order.products.find((p) => String(p.productId) === productId);
  if (!product) return next(new AppError("Product not found", 404));
  if (String(order.buyerId) !== String(sessionUser._id))
    return next(new AppError("Not authorized", 403));

  product.status = "completed";
  await order.save();
  res.json({ message: "Delivery confirmed", product });
});

// ✅ Dispute a product
export const disputeProduct = catchAsync(async (req, res, next) => {
  const sessionUser = req.session.user;
  const { orderId, productId } = req.params;
  const { reason, message } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return next(new AppError("Order not found", 404));

  const product = order.products.find((p) => String(p.productId) === productId);
  if (!product) return next(new AppError("Product not found", 404));

  if (!product.dispute) product.dispute = { messages: [] };
  product.status = "disputed";
  product.dispute.reason = reason;
  product.dispute.messages.push({
    sender: sessionUser.role,
    message,
    date: new Date(),
  });

  await order.save();
  res.json({ message: "Dispute created", product });
});

export const cancelOrder = catchAsync(async (req, res, next) => {
  const sessionUser = req.session.user;

  if (!sessionUser) {
    return next(new AppError("Not authorized", 401));
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // ✅ Ensure only the buyer or admin can cancel
  if (
    sessionUser.role !== "admin" &&
    String(order.buyerId) !== String(sessionUser._id)
  ) {
    return next(new AppError("Not authorized to cancel this order", 403));
  }

  // ✅ Optional: Check product-level statuses if needed
  const hasShippedItem = order.products.some(
    (p) => p.status === "shipped" || p.status === "completed"
  );
  if (hasShippedItem) {
    return next(
      new AppError("Cannot cancel an order that has shipped items", 400)
    );
  }

  // ✅ Perform cancellation — you can delete or mark as cancelled
  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
  });
});

export const getOrderById = catchAsync(async (req, res, next) => {
  const sessionUser = req.session.user;
  if (!sessionUser) return next(new AppError("Not authorized", 401));

  // Fetch order without wrong populate
  const order = await Order.findById(req.params.id).populate({
    path: "products.productId", // match your schema
    select: "_id title price category description", // optional
  });

  if (!order) return next(new AppError("Order not found", 404));

  // Check if current user is allowed to see this order
  if (
    sessionUser.role !== "admin" &&
    String(order.buyerId) !== String(sessionUser._id)
  ) {
    return next(new AppError("Not authorized to view this order", 403));
  }

  res.json(order);
});

export const getMyOrders = catchAsync(async (req, res, next) => {
  const sessionUser = req.session.user;
  if (!sessionUser) return next(new AppError("Not authorized", 401));

  const orders = await Order.find({ buyerId: sessionUser._id }).populate(
    "products.productId"
  );

  res.json(orders);
});

export const getOrders = catchAsync(async (req, res, next) => {
  const sessionUser = req.session.user;
  if (!sessionUser || sessionUser.role !== "admin")
    return next(new AppError("Not authorized, admin only", 403));
  const orders = await Order.find()
    .populate("products.productId")
    .populate("buyerId", "name email");
  res.json(orders);
});

export const getSellerOrders = catchAsync(async (req, res, next) => {
  const sessionUser = req.session.user;

  if (!sessionUser || sessionUser.role !== "seller") {
    return next(new AppError("Not authorized, sellers only", 403));
  }

  // Fetch orders for this seller and populate necessary references
  const orders = await Order.find({ "products.sellerId": sessionUser._id })
    .populate("buyerId", "name email") // Buyer info
    .populate("products.productId", "title price images") // Product info
    .populate("address") // Delivery address
    .lean();

  // Flatten each product into its own object with address included
  const flatOrders = orders
    .map((order) =>
      order.products.map((p) => ({
        _id: p._id,
        orderId: order._id,
        productId: p.productId?._id,
        product: p.productId?.title || "Product",
        buyerName: order.buyerId?.name || "Unknown",
        buyerEmail: order.buyerId?.email || "N/A",
        status: p.status,
        total: (p.productId?.price || 0) * (p.quantity || 1),
        // Shipping address and phone
        address: order.address
          ? `${order.address.street || ""}, ${order.address.city || ""}, ${
              order.address.region || ""
            }`
          : "No address provided",
        phone: order.address?.phone || "N/A",
      }))
    )
    .flat();

  res.json(flatOrders);
});

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
