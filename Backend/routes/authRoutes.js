import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import * as authController from "../controllers/authController.js";
import * as oauthController from "../controllers/oauthController.js";
import { upload } from "../middlewares/upload.js"; // your multer setup

const router = express.Router();

// ---------------------
// Email/Password Auth
// ---------------------
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/me", protect, upload.single("avatar"), authController.getMe);
router.put("/me", protect, authController.updateMe);
router.post("/logout", authController.logoutUser);
router.get("/check", authController.checkAuth);

// ---------------------
// GitHub OAuth
// ---------------------
router.get("/github", oauthController.githubLogin);
router.get("/github/callback", oauthController.githubCallback);

// ---------------------
// Google OAuth
// ---------------------
router.get("/google", oauthController.googleLogin);
router.get("/google/callback", oauthController.googleCallback);

export default router;
