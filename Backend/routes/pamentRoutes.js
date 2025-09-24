// routes/paymentRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  payWithCOD,
  payWithTeleBirr,
  teleBirrCallback,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/cod", protect, payWithCOD);
router.post("/telebirr", protect, payWithTeleBirr);
router.post("/telebirr/callback", teleBirrCallback);

export default router;
