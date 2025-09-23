import express from "express";
import {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  payOrder,
  cancelOrder,
} from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create order
router.post("/", createOrder);

// Get my orders
router.get("/myorders", getMyOrders);

// Get all orders (admin only)
router.get("/", getOrders);

// Get single order
router.get("/:id", getOrderById);

// Update order status (admin only)
router.put("/:id/status", updateOrderStatus);

// Pay order
router.put("/:id/pay", payOrder);

// Cancel order
router.delete("/:id", cancelOrder);

export default router;
