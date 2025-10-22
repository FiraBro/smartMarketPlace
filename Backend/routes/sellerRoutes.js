import express from "express";
import { protect, checkSellerStatus } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";
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
router.post(
  "/profile",
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  createSellerProfile
);
router.get("/profile", getSellerProfile);
router.put(
  "/profile",
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  updateSellerProfile
);

// Seller products
router.get("/products", getSellerProducts);

// Seller orders
router.get("/orders", checkSellerStatus, getSellerOrders);
router.put("/orders/:id", checkSellerStatus, updateOrderStatus);

export default router;
