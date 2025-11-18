import { Router } from "express";
import {
  protect,
  protectSeller,
  restrictTo,
} from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";
import {
  listListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getCategories,
  getListingDetails,
} from "../controllers/listingController.js";

const router = Router();

// ==================== PUBLIC ROUTES ====================

// Fetch ALL listings
router.get("/", listListings);

// Admin Detailed listing stats (MUST BE ABOVE /:id)
router.get("/details", restrictTo("admin"), getListingDetails);

// Category list (must be above /:id)
router.get("/categories", getCategories);

// Fetch a single listing
router.get("/:id", getListingById);

// ==================== PROTECTED ROUTES ====================

router.post(
  "/create",
  protect,
  protectSeller,
  upload.array("images", 10),
  createListing
);

router.patch(
  "/:id",
  protect,
  protectSeller,
  upload.array("images", 10),
  updateListing
);

router.delete("/:id", protect, protectSeller, deleteListing);

export default router;
