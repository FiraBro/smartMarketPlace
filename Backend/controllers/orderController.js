import catchAsync from "../utils/catchAsync.js";
import * as orderService from "../services/orderService.js";

// ----------------------------
// Controller
// ----------------------------
export const createOrder = catchAsync(async (req, res) => {
  const sessionUser = orderService.getSessionUser(req);
  const { products, address, deliveryMethod } = req.body;

  const order = await orderService.createOrderService(
    sessionUser,
    products,
    address,
    deliveryMethod,
  );

  res.status(201).json(order);
});

export const uploadPaymentProof = catchAsync(async (req, res) => {
  const sessionUser = orderService.getSessionUser(req);
  const { orderId, productId } = req.params;
  const { transactionId } = req.body;

  const product = await orderService.uploadPaymentProofService(
    sessionUser,
    orderId,
    productId,
    req.file,
    transactionId,
  );

  res.json({ message: "Payment proof uploaded", product });
});

// --- BUYER CONTROLLERS ---
export const getMyOrders = catchAsync(async (req, res) => {
  const sessionUser = orderService.getSessionUser(req);
  const orders = await orderService.getMyOrdersService(sessionUser._id);
  res.json(orders);
});

export const cancelOrder = catchAsync(async (req, res) => {
  const sessionUser = orderService.getSessionUser(req);
  await orderService.cancelOrderService(req.params.id, sessionUser._id);
  res.status(204).json({ message: "Order cancelled" });
});

export const confirmDelivery = catchAsync(async (req, res) => {
  const sessionUser = orderService.getSessionUser(req);
  const { orderId, productId } = req.params;
  const product = await orderService.confirmDeliveryService(
    orderId,
    productId,
    sessionUser._id,
  );
  res.json({ message: "Delivery confirmed", product });
});

export const disputeProduct = catchAsync(async (req, res) => {
  const sessionUser = orderService.getSessionUser(req);
  const { orderId, productId } = req.params;
  const { reason } = req.body;
  const product = await orderService.disputeProductService(
    orderId,
    productId,
    sessionUser._id,
    reason,
  );
  res.json({ message: "Dispute opened", product });
});

// --- SELLER CONTROLLERS ---
export const getSellerOrders = catchAsync(async (req, res) => {
  const sessionUser = orderService.getSessionUser(req);
  const orders = await orderService.getSellerOrdersService(sessionUser._id);
  res.json(orders);
});

export const markAsShipped = catchAsync(async (req, res) => {
  const sessionUser = orderService.getSessionUser(req);
  const { orderId, productId } = req.params;
  const product = await orderService.markAsShippedService(
    orderId,
    productId,
    sessionUser._id,
  );
  res.json({ message: "Product marked as shipped", product });
});

// --- ADMIN CONTROLLERS ---
export const getOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getAllOrdersService();
  res.json(orders);
});

export const verifyPayment = catchAsync(async (req, res) => {
  const { orderId, productId } = req.params;
  const product = await orderService.verifyPaymentService(orderId, productId);
  res.json({ message: "Payment verified", product });
});

export const releaseFunds = catchAsync(async (req, res) => {
  const { orderId, productId } = req.params;
  const product = await orderService.releaseFundsService(orderId, productId);
  res.json({ message: "Funds released to seller", product });
});

// General
export const getOrderById = catchAsync(async (req, res) => {
  const order = await orderService.getOrderByIdService(req.params.id);
  res.json(order);
});

// Add this to your orderController.js
export const updateSellerOrderStatus = catchAsync(async (req, res) => {
  const sessionUser = orderService.getSessionUser(req);
  const { orderId, productId, status } = req.body;

  const product = await orderService.updateProductStatusService(
    orderId,
    productId,
    sessionUser._id,
    status,
  );

  res.json({ message: "Status updated successfully", product });
});
