import express from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
  createSellerProfile,
  getSellerProfile,
  updateSellerProfile,
  getSellerProducts,
  getSellerOrders,
  updateOrderStatus,
} from "../controllers/sellerController.js";

const router = express.Router();

// ✅ All routes are protected and seller-only
router.use(protect);
// Seller profile
router.post("/profile", createSellerProfile);
router.get("/profile", getSellerProfile);
router.put("/profile", updateSellerProfile);

// Seller products
router.get("/products", getSellerProducts);

// Seller orders
router.get("/orders", getSellerOrders);
router.put("/orders/:id", updateOrderStatus);

export default router;
