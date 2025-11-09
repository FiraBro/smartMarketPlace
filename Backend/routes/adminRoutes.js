import express from "express";

// -------------------------
// Controllers
// -------------------------
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getMeAdmin,
  approveSeller,
  suspendSeller,
  getListingDetails,
  verifyPayment,
  releaseFunds,
} from "../controllers/adminController.js";

import {
  sendNotification,
  deleteNotification,
  getNotificationHistory,
  getNotificationById,
} from "../controllers/notificationController.js";

import { getAllBuyer, getAllSellers } from "../controllers/authController.js";

// -------------------------
// Middlewares
// -------------------------
import {
  protectAdmin,
  restrictToAdmin,
} from "../middlewares/adminMiddleware.js";

const router = express.Router();

// ==========================
// Public Routes
// ==========================
router.post("/registerAdmin", registerAdmin);
router.post("/loginAdmin", loginAdmin);

// ==========================
// Protected Routes (Admin)
// ==========================
router.use(protectAdmin); // All routes below require authentication

router.post("/logoutAdmin", logoutAdmin);
router.get("/meAdmin", getMeAdmin);

// --------------------------
// Users
// --------------------------
router.get("/buyers", restrictToAdmin("admin", "super-admin"), getAllBuyer);
router.get("/sellers", restrictToAdmin("admin", "super-admin"), getAllSellers);

// --------------------------
// Listings
// --------------------------
router.get("/listings/details", restrictToAdmin("admin"), getListingDetails);

// --------------------------
// Seller Actions
// --------------------------
router.patch("/:sellerId/approve", restrictToAdmin("admin"), approveSeller);
router.patch("/:sellerId/suspend", restrictToAdmin("admin"), suspendSeller);

// --------------------------
// Notifications
// --------------------------
router
  .route("/notifications")
  .post(restrictToAdmin("admin"), sendNotification)
  .get(restrictToAdmin("admin"), getNotificationHistory);

router
  .route("/notifications/:id")
  .get(restrictToAdmin("admin"), getNotificationById)
  .delete(restrictToAdmin("admin"), deleteNotification);

router.patch("/verify/:id", verifyPayment);
router.patch("/release/:id", releaseFunds);

// ==========================
// Super Admin Only
// ==========================
router.get("/admin-only", restrictToAdmin("super-admin"), (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome super admin!",
  });
});

export default router;
