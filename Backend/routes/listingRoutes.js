import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
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
router.post("/", protect, upload.array("images", 10), createListing);
router.patch("/:id", protect, upload.array("images", 10), updateListing);
router.delete("/:id", protect, deleteListing);

export default router;
