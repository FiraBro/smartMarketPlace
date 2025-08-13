import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  sendMessage,
  getChatMessages,
} from "../controllers/messageController.js";

const router = express.Router();

// Send a message
router.post("/", protect, sendMessage);

// Get all messages for a chat
router.get("/:chatId", protect, getChatMessages);

export default router;
