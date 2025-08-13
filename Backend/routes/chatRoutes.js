import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createOrGetChat,
  getUserChats,
} from "../controllers/chatController.js";

const router = express.Router();

// Create/access chat between buyer & seller
router.post("/", protect, createOrGetChat);

// Get all chats for logged-in user
router.get("/", protect, getUserChats);

export default router;
