import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
// ========================== USER CONTROLLERS ================================

// -------------------------
// Get paginated notifications for the logged-in user
// -------------------------
export const getUserNotifications = catchAsync(async (req, res, next) => {
  const user = req.session.user;
  if (!user?._id) {
    return res.status(401).json({ status: "fail", message: "User not authenticated" });
  }

  const userId = user._id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const notifications = await Notification.find({
    $or: [{ recipients: userId }, { recipientType: "all" }],
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const transformedNotifications = notifications.map((notification) => ({
    ...notification,
    read: notification.readBy?.includes(userId.toString()) || false,
  }));

  const totalNotifications = await Notification.countDocuments({
    $or: [{ recipients: userId }, { recipientType: "all" }],
  });

  res.status(200).json({
    status: "success",
    results: transformedNotifications.length,
    notifications: transformedNotifications,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalNotifications / limit),
      totalNotifications,
      hasMore: page < Math.ceil(totalNotifications / limit),
    },
  });
});

// -------------------------
// Mark a single notification as read
// -------------------------
export const markAsRead = catchAsync(async (req, res, next) => {
  const user = req.session.user;
  if (!user?._id) {
    return res.status(401).json({ status: "fail", message: "User not authenticated" });
  }

  const userId = user._id;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid notification ID", 400));
  }

  const notification = await Notification.findById(id);
  if (!notification) {
    return next(new AppError("Notification not found", 404));
  }

  const hasAccess = notification.recipients.includes(userId) || notification.recipientType === "all";
  if (!hasAccess) {
    return next(new AppError("Unauthorized to access this notification", 403));
  }

  if (!notification.readBy.includes(userId)) {
    notification.readBy.push(userId);
    await notification.save();
  }

  res.status(200).json({
    status: "success",
    message: "Notification marked as read",
    notification: { ...notification.toObject(), read: true },
  });
});

// -------------------------
// Mark all notifications as read
// -------------------------
export const markAllAsRead = catchAsync(async (req, res, next) => {
  const user = req.session.user;
  if (!user?._id) {
    return res.status(401).json({ status: "fail", message: "User not authenticated" });
  }

  const userId = user._id;

  await Notification.updateMany(
    {
      $or: [{ recipients: userId }, { recipientType: "all" }],
      readBy: { $ne: userId },
    },
    { $push: { readBy: userId } }
  );

  res.status(200).json({
    status: "success",
    message: "All notifications marked as read",
  });
});
