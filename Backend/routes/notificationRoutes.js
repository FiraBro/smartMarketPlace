import express from "express";
// Update these names to match exactly what is in your controller file
import {
  getUserNotificationsController,
  markAllAsReadController,
  markAsReadController,
} from "../controllers/userNotificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect); // Applies protection to all routes below

// ============================ USER ROUTES ============================== //
router.get("/user", getUserNotificationsController);
router.patch("/read-all", markAllAsReadController);
router.patch("/:id/read", markAsReadController);

export default router;
