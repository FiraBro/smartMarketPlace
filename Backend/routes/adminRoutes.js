import express from "express";

// -------------------------
// Controllers
// -------------------------
import {
  approveSeller,
  suspendSeller,
  verifyPayment,
  releaseFunds,
} from "../controllers/adminController.js";

import {
  sendNotification,
  deleteNotification,
  getNotificationHistory,
  getNotificationById,
} from "../controllers/notificationController.js";

// -------------------------
// Middlewares
// -------------------------
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ==========================
// Protected Routes (Admin)
// ==========================
router.use(protect); // All routes below require authentication

// --------------------------

// --------------------------

// --------------------------
// Seller Actions
// --------------------------
router.patch("/:sellerId/approve", restrictTo("admin"), approveSeller);
router.patch("/:sellerId/suspend", restrictTo("admin"), suspendSeller);

// --------------------------
// Notifications
// --------------------------
router
  .route("/notifications")
  .post(restrictTo("admin"), sendNotification)
  .get(restrictTo("admin"), getNotificationHistory);

router
  .route("/notifications/:id")
  .get(restrictTo("admin"), getNotificationById)
  .delete(restrictTo("admin"), deleteNotification);

router.patch("/verify/:id", verifyPayment);
router.patch("/release/:id", releaseFunds);

// ==========================
// Super Admin Only
// ==========================
router.get("/admin-only", restrictTo("super-admin"), (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome super admin!",
  });
});

export default router;
