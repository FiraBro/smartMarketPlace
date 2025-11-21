import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import AppError from "../utils/AppError.js";

/**
 * Get paginated notifications for a user
 * @param {String} userId
 * @param {Number} page
 * @param {Number} limit
 */
export const getUserNotifications = async (userId, page = 1, limit = 10) => {
  if (!userId) throw new AppError("User not authenticated", 401);

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

  return {
    notifications: transformedNotifications,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalNotifications / limit),
      totalNotifications,
      hasMore: page < Math.ceil(totalNotifications / limit),
    },
  };
};

/**
 * Mark a single notification as read
 * @param {String} userId
 * @param {String} notificationId
 */
export const markNotificationAsRead = async (userId, notificationId) => {
  if (!userId) throw new AppError("User not authenticated", 401);

  if (!mongoose.Types.ObjectId.isValid(notificationId))
    throw new AppError("Invalid notification ID", 400);

  const notification = await Notification.findById(notificationId);
  if (!notification) throw new AppError("Notification not found", 404);

  const hasAccess =
    notification.recipients.includes(userId) ||
    notification.recipientType === "all";
  if (!hasAccess)
    throw new AppError("Unauthorized to access this notification", 403);

  if (!notification.readBy.includes(userId)) {
    notification.readBy.push(userId);
    await notification.save();
  }

  return { ...notification.toObject(), read: true };
};

/**
 * Mark all notifications as read for a user
 * @param {String} userId
 */
export const markAllNotificationsAsRead = async (userId) => {
  if (!userId) throw new AppError("User not authenticated", 401);

  await Notification.updateMany(
    {
      $or: [{ recipients: userId }, { recipientType: "all" }],
      readBy: { $ne: userId },
    },
    { $push: { readBy: userId } }
  );
};
