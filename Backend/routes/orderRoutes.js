import express from "express";
import {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getSellerOrders,
  updateSellerOrderStatus,
  uploadPaymentProof,
  verifyPayment,
  releaseFunds,
  markAsShipped,
  confirmDelivery,
  disputeProduct,
} from "../controllers/orderController.js";
import { upload } from "../middlewares/upload.js"; // ✅ use your shared multer config
import { restrictTo } from "../middlewares/authMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ================== ORDER ROUTES ==================
router.use(protect);

// Buyer creates an order
router.post("/", createOrder);

// Buyer uploads payment proof for a specific product
router.post(
  "/:orderId/products/:productId/payment-proof",
  upload.single("file"),
  uploadPaymentProof
);

// Buyer confirms delivery per product
router.post("/:orderId/products/:productId/confirm-delivery", confirmDelivery);

// Buyer disputes a product
router.post("/:orderId/products/:productId/dispute", disputeProduct);

// Buyer cancels order
router.delete("/:id/cancel", cancelOrder);

// Get all orders (admin only)
router.get("/", restrictTo("admin"), getOrders);

// Get my orders (buyer)
router.get("/my-orders", getMyOrders);

// ================== SELLER ROUTES ==================

// Get orders containing seller's products
router.get("/seller/orders", getSellerOrders);

// Seller updates status of their products
router.patch("/seller/products/status", updateSellerOrderStatus);

// Seller marks product as shipped
router.post("/:orderId/products/:productId/ship", markAsShipped);

// ================== ADMIN ROUTES ==================

// Admin verifies payment and holds funds
router.post("/:orderId/products/:productId/verify-payment", verifyPayment);

// Admin releases funds to seller after delivery
router.post("/:orderId/products/:productId/release-funds", releaseFunds);

// Get a single order by ID (general route) – must be after all more specific routes
router.get("/:id", getOrderById);

export default router;
