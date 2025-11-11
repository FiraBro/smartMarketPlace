import express from "express";
import {
  checkSellerStatus,
  protectSeller,
} from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";
import {
  createSellerProfile,
  getSellerProfile,
  updateSellerProfile,
  getSellerProductsControllers,
  getSellerOrdersControllers,
  updateOrderStatusControllers,
  getRecentSellerOrdersControllers,
  getSellerDashboardController,
} from "../controllers/sellerController.js";

const router = express.Router();

// ✅ All routes are protected and seller-only
router.use(protectSeller);
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
router.get("/products", getSellerProductsControllers);

router.get("/dashboard", getSellerDashboardController);

// Seller orders
router.get("/orders", getSellerOrdersControllers);
router.put("/orders/:id", checkSellerStatus, updateOrderStatusControllers);
router.get("/recent-orders", getRecentSellerOrdersControllers);

export default router;
