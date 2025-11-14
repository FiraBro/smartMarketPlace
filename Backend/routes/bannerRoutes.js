// routes/bannerRoutes.js
import express from "express";
import { uploadBanner, getBanners } from "../controllers/bannerController.js";
import { upload } from "../middlewares/upload.js";

const bannerRoutes = express.Router();

// ✅ Use fieldname "banner" to match your Cloudinary params (optional)
bannerRoutes.post("/", upload.single("banner"), uploadBanner);

// Fetch all banners
bannerRoutes.get("/", getBanners);

export default bannerRoutes;
