// routes/bannerRoutes.js
import express from "express";
import { uploadBanner, getBanners } from "../controllers/bannerController.js";
import { upload } from "../middlewares/upload.js";
const bannerRoutes = express.Router();

bannerRoutes.post("/", upload.single("image"), uploadBanner);
bannerRoutes.get("/", getBanners);

export default bannerRoutes;
