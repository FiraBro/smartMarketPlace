import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import { User } from "../models/User.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

// ========================== ADMIN CONTROLLERS ===============================

// Send a new notification
export const sendNotification = catchAsync(async (req, res, next) => {
  const { title, message, channel, type, recipientType } = req.body;

  if (!title || !message || !channel || !type || !recipientType) {
    return next(new AppError("Required field is missing", 400));
  }

  // Determine recipients based on recipientType
  let recipients = [];
  if (recipientType === "all") {
    const users = await User.find({}, "_id");
    recipients = users.map((u) => u._id);
  } else if (recipientType === "seller") {
    const sellers = await User.find({ role: "seller" }, "_id");
    recipients = sellers.map((s) => s._id);
  } else if (recipientType === "buyer") {
    const buyers = await User.find({ role: "buyer" }, "_id");
    recipients = buyers.map((b) => b._id);
  } else {
    return next(new AppError("Invalid recipient type", 400));
  }

  const notification = await Notification.create({
    title,
    message,
    channel,
    type,
    recipientType,
    recipients,
    createdBy: req.user?._id || null,
  });

  // Emit real-time notifications
  const io = req.app.get("io");
  recipients.forEach((userId) => {
    io.to(`notifications:${userId}`).emit("notification", notification);
  });

  res.status(201).json({
    status: "success",
    message: "Notification sent successfully",
    notification,
  });
});

// Delete notification
export const deleteNotification = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid notification ID", 400));
  }

  const notification = await Notification.findByIdAndDelete(id);
  if (!notification) {
    return next(new AppError("Notification not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Notification deleted successfully",
  });
});

// Get notification history
export const getNotificationHistory = catchAsync(async (req, res) => {
  const { channel, status, dateRange } = req.query;
  const query = {};

  if (channel && channel !== "all") query.channel = channel;
  if (status && status !== "all") query.status = status;

  if (dateRange) {
    const now = new Date();
    let startDate;
    switch (dateRange) {
      case "today":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "7days":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "30days":
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case "90days":
        startDate = new Date(now.getDate() - 90);
        break;
      default:
        startDate = null;
    }
    if (startDate) query.createdAt = { $gte: startDate };
  }

  const notifications = await Notification.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: notifications.length,
    notifications,
  });
});

// Get single notification
export const getNotificationById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid notification ID", 400));
  }

  const notification = await Notification.findById(id);
  if (!notification) {
    return next(new AppError("Notification not found", 404));
  }

  res.status(200).json({
    status: "success",
    notification,
  });
});

