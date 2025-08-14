import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
} from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post("/", createOrder); // Create a new order
router.get("/", getOrders); // Get all orders
router.get("/:id", getOrderById); // Get a single order by ID

export default router;
