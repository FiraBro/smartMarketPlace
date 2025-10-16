import express from "express";
import {
  register,
  login,
  logout,
  getMe,
} from "../controllers/adminController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
// router.get("/check-auth", isAuthenticated);

// Protected routes
router.use(protect); // All routes after this middleware are protected

router.post("/logout", logout);
router.get("/me", getMe);

// Super admin only routes
router.get("/admin-only", restrictTo("super-admin"), (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome super admin!",
  });
});

export default router;
