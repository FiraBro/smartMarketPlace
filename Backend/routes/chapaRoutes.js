import express from "express";
import {
  initializePayment,
  verifyPayment,
  chapaWebhook,
} from "../controllers/chapaController.js";

const router = express.Router();

router.post("/initialize", initializePayment);
router.get("/verify/:transaction_id", verifyPayment);
router.post("/webhook", chapaWebhook);

export default router;
