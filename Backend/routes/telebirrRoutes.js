import express from "express";
import {
  initializeTelebirrPayment,
  telebirrWebhook,
} from "../controllers/telebirrController.js";

const router = express.Router();

router.post("/initialize", initializeTelebirrPayment);
router.post("/notify", telebirrWebhook);

export default router;
