import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Registration Route
router.post("/register", registerUser);

// Login Route
router.post("/login", loginUser);
router.get("/me", protect, getMe);

export default router;
