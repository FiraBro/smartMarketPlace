import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  updateMe,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Registration Route
router.post("/register", registerUser);

// Login Route
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

export default router;
