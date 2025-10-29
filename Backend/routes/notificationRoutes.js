import express from "express";
import {getUserNotifications,markAllAsRead,markAsRead} from '../controllers/userNotificationController.js'
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

// ============================ USER ROUTES ============================== //
router.route("/user").get(protect, getUserNotifications);
router.route("/read-all").patch(protect, markAllAsRead);
router.route("/:id/read").patch(protect, markAsRead);

export default router;
