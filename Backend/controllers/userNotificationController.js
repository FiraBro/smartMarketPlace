import catchAsync from "../utils/catchAsync.js";
import * as notificationService from "../services/userNotificationService.js";

/**
 * Get paginated notifications
 */
export const getUserNotificationsController = catchAsync(async (req, res) => {
  const userId = req.session.user?._id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const result = await notificationService.getUserNotifications(
    userId,
    page,
    limit
  );

  res.status(200).json({
    status: "success",
    results: result.notifications.length,
    notifications: result.notifications,
    pagination: result.pagination,
  });
});

/**
 * Mark a single notification as read
 */
export const markAsReadController = catchAsync(async (req, res) => {
  const userId = req.session.user?._id;
  const { id } = req.params;

  const notification = await notificationService.markNotificationAsRead(
    userId,
    id
  );

  res.status(200).json({
    status: "success",
    message: "Notification marked as read",
    notification,
  });
});

/**
 * Mark all notifications as read
 */
export const markAllAsReadController = catchAsync(async (req, res) => {
  const userId = req.session.user?._id;

  await notificationService.markAllNotificationsAsRead(userId);

  res.status(200).json({
    status: "success",
    message: "All notifications marked as read",
  });
});
