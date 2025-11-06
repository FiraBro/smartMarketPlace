import express from "express";
import { sendSupportMessage } from "../controllers/supportController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { supportMessageSchema } from "../middlewares/validatorMiddleware.js";
const router = express.Router();

router.post("/contact", validate(supportMessageSchema), sendSupportMessage);

export default router;
