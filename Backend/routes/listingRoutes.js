import { Router } from "express";
import {
  protect,
  protectSeller,
  // checkSellerStatus,
} from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";
import {
  listListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getAllListings,
  getCategories,
} from "../controllers/listingController.js";

const router = Router();

// ✅ Specific routes first
router.get("/", listListings);
router.get("/all", getAllListings);
router.get("/categories", getCategories); // must be above "/:id"
router.get("/:id", getListingById);

// ✅ Protected CRUD routes
router.post(
  "/create",
  protect,
  // checkSellerStatus,
  protectSeller,
  upload.array("images", 10),
  createListing
);
router.patch(
  "/:id",
  protect,
  // checkSellerStatus,
  protectSeller,
  upload.array("images", 10),
  updateListing
);
router.delete("/:id", protect, protectSeller, deleteListing);

export default router;
