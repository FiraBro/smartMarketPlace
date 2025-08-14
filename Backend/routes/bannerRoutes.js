import { Router } from "express";
import {
  createBanner,
  getActiveBanners,
  updateBanner,
  deleteBanner,
} from "../controllers/banner.controller.js";
import { cacheTTL } from "../middleware/cacheTTL.js";
import { isAdmin } from "../middleware/isAdmin.js";
// Use your existing multer middleware (upload.array('images', 10))
import upload from "../middleware/upload.js"; // assumed existing

const router = Router();

router.get(
  "/",
  cacheTTL(() => "home:banners", 5 * 60_000),
  getActiveBanners
);

router.post("/", isAdmin, upload.array("images", 10), createBanner);
router.patch("/:id", isAdmin, upload.array("images", 10), updateBanner);
router.delete("/:id", isAdmin, deleteBanner);

export default router;
