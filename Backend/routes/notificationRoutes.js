import express from "express";
import {
  sendNotification,
  deleteNotification,
  getNotificationHistory,
  getNotificationById,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController.js";

import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ============================ ADMIN ROUTES ============================= //
// Only admin can send, view, or delete notifications
router
  .route("/admin")
  .post(protect, restrictTo("admin"), sendNotification) // Send new notification
  .get(protect, restrictTo("admin"), getNotificationHistory); // Get all notification history

router
  .route("/admin/:id")
  .get(protect, restrictTo("admin"), getNotificationById) // Get specific notification by ID
  .delete(protect, restrictTo("admin"), deleteNotification); // Delete notification

// ============================ USER ROUTES ============================== //
// User-specific notifications
router.route("/").get(protect, getUserNotifications); // Get all notifications for logged-in user

router.route("/read/:id").patch(protect, markAsRead); // Mark one notification as read

router.route("/read-all").patch(protect, markAllAsRead); // Mark all notifications as read

export default router;
