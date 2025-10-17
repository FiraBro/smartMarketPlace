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

import { protect } from "../middlewares/authMiddleware.js";
import {
  protectAdmin,
  restrictToAdmin,
} from "../middlewares/adminMiddleware.js";

const router = express.Router();

// ============================ ADMIN ROUTES ============================= //
// Only admin can send, view, or delete notifications
router
  .route("/admin")
  .post(protectAdmin, restrictToAdmin("admin"), sendNotification) // Send new notification
  .get(protectAdmin, restrictToAdmin("admin"), getNotificationHistory); // Get all notification history

router
  .route("/admin/:id")
  .get(protect, restrictToAdmin("admin"), getNotificationById) // Get specific notification by ID
  .delete(protect, restrictToAdmin("admin"), deleteNotification); // Delete notification

// ============================ USER ROUTES ============================== //
// User-specific notifications
router.route("/").get(protect, getUserNotifications); // Get all notifications for logged-in user

router.route("/read/:id").patch(protect, markAsRead); // Mark one notification as read

router.route("/read-all").patch(protect, markAllAsRead); // Mark all notifications as read

export default router;
