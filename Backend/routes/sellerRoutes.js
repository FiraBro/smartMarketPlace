import express from "express";
import { protect, checkSellerStatus } from "../middlewares/authMiddleware.js";
import {
  createSellerProfile,
  getSellerProfile,
  updateSellerProfile,
  getSellerProducts,
  getSellerOrders,
  updateOrderStatus,
  becomeSeller,
} from "../controllers/sellerController.js";

const router = express.Router();

// ✅ All routes are protected and seller-only
router.use(protect);
// Seller profile
router.post("/become-seller", becomeSeller);
router.post("/profile", createSellerProfile);
router.get("/profile", getSellerProfile);
router.put("/profile", updateSellerProfile);

// Seller products
router.get("/products", getSellerProducts);

// Seller orders
router.get("/orders", checkSellerStatus, getSellerOrders);
router.put("/orders/:id", checkSellerStatus, updateOrderStatus);

export default router;
