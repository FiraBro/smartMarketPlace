// routes/verificationRoutes.js
import express from "express";
import { sendCode, verifyCode } from "../controllers/verificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:field/send", protect, sendCode);
router.post("/:field/verify", protect, verifyCode);

export default router;
