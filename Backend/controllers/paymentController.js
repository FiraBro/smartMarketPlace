// controllers/paymentController.js
import Order from "../models/Order.js";
import axios from "axios";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

// ✅ Cash on Delivery
export const payWithCOD = catchAsync(async (req, res, next) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return next(new AppError("Order not found", 404));

  // COD just stays "Pending" until delivery is confirmed
  order.paymentMethod = "COD";
  order.paymentStatus = "Pending";
  await order.save();

  res.json({ message: "Order placed with COD", order });
});

// ✅ TeleBirr
export const payWithTeleBirr = catchAsync(async (req, res, next) => {
  const { orderId, phone } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return next(new AppError("Order not found", 404));

  order.paymentMethod = "TeleBirr";
  order.paymentStatus = "Pending";
  await order.save();

  // 🔗 Call TeleBirr API (pseudo — replace with real endpoint)
  const payload = {
    outTradeNo: order._id.toString(),
    subject: "Order Payment",
    totalAmount: order.totalAmount || 100, // ensure your schema includes total
    shortCode: process.env.TELEBIRR_SHORTCODE,
    notifyUrl: `${process.env.BASE_URL}/api/payments/telebirr/callback`,
    returnUrl: `${process.env.FRONTEND_URL}/orders/${order._id}`,
    timeoutExpress: "30m",
  };

  const response = await axios.post("https://api.telebirr.com/pay", payload, {
    headers: { Authorization: `Bearer ${process.env.TELEBIRR_TOKEN}` },
  });

  res.json({ paymentUrl: response.data.paymentUrl, order });
});

// ✅ TeleBirr callback
export const teleBirrCallback = catchAsync(async (req, res) => {
  const { outTradeNo, tradeStatus } = req.body;

  const order = await Order.findById(outTradeNo);
  if (!order) return res.sendStatus(404);

  if (tradeStatus === "SUCCESS") {
    order.paymentStatus = "Paid";
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = "paid";
  } else {
    order.paymentStatus = "Failed";
  }

  await order.save();
  res.sendStatus(200);
});
