import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import { Notification } from "../models/Notification.js";

// Get all notifications for logged-in user
export const getNotifications = catchAsync(async (req, res, next) => {
  const userId = req.session.user?._id;
  if (!userId) return next(new AppError("Not authorized", 401));

  const notifications = await Notification.find({ user: userId }).sort({
    createdAt: -1,
  });
  res.status(200).json({ notifications });
});

// Create a new notification
export const createNotification = catchAsync(async (req, res, next) => {
  const userId = req.session.user?._id;
  if (!userId) return next(new AppError("Not authorized", 401));

  const { type, title, message } = req.body;
  const notification = await Notification.create({
    user: userId,
    type,
    title,
    message,
  });

  // Emit via socket if io is set
  const io = req.app.get("io");
  if (io) io.to(`user:${userId}`).emit("newNotification", notification);

  res.status(201).json({ notification });
});

// Mark a notification as read
export const markAsRead = catchAsync(async (req, res, next) => {
  const userId = req.session.user?._id;
  if (!userId) return next(new AppError("Not authorized", 401));

  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: userId },
    { read: true },
    { new: true }
  );

  if (!notification) return next(new AppError("Notification not found", 404));

  res.status(200).json({ notification });
});

// Delete a notification
export const deleteNotification = catchAsync(async (req, res, next) => {
  const userId = req.session.user?._id;
  if (!userId) return next(new AppError("Not authorized", 401));

  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    user: userId,
  });

  if (!notification) return next(new AppError("Notification not found", 404));

  res.status(204).send();
});
