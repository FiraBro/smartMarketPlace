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
import { protectAdmin, restrictToAdmin } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// ============================ ADMIN ROUTES ============================= //
router
  .route("/")
  .post(protectAdmin, restrictToAdmin("admin"), sendNotification)
  .get(protectAdmin, restrictToAdmin("admin"), getNotificationHistory);

router
  .route("/:id")
  .get(protectAdmin, restrictToAdmin("admin"), getNotificationById)
  .delete(protectAdmin, restrictToAdmin("admin"), deleteNotification);

// ============================ USER ROUTES ============================== //
router.route("/user").get(protect, getUserNotifications);
router.route("/read-all").patch(protect, markAllAsRead);
router.route("/:id/read").patch(protect, markAsRead);

export default router;
