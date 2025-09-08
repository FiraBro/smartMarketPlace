// routes/bannerRoutes.js
import express from "express";
import { uploadBanner } from "../controllers/bannerController.js";
import { upload } from "../middlewares/upload.js";
const bannerRoutes = express.Router();

bannerRoutes.post("/", upload.single("image"), uploadBanner);

export default bannerRoutes;
