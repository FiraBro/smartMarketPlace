import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/authController.js";

const router = express.Router();

// Registration Route
router.post("/register", registerUser);

// Login Route
router.post("/login", loginUser);
router.get("/me", getMe);

export default router;
