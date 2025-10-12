import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import * as authController from "../controllers/authController.js";
import * as oauthController from "../controllers/oauthController.js";

const router = express.Router();

// Email/password routes
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/me", protect, authController.getMe);
router.put("/me", protect, authController.updateMe);

// GitHub OAuth
router.get("/github", oauthController.githubLogin);
router.get("/github/callback", oauthController.githubCallback);

// Facebook OAuth
router.get("/facebook", oauthController.facebookLogin);
router.get("/facebook/callback", oauthController.facebookCallback);

export default router;
