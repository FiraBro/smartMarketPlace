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
} from "../controllers/listingController.js";

const router = Router();

router.get("/", listListings);
router.get("/all", getAllListings); // paginated, no filters
router.get("/:id", getListingById);
router.post("/", protect, upload.array("images", 10), createListing);
router.patch("/:id", protect, upload.array("images", 10), updateListing);
router.delete("/:id", protect, deleteListing);

export default router;
