import express from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getMeAdmin,
  approveSeller,
  suspendSeller,
} from "../controllers/adminController.js";
import {
  protectAdmin,
  restrictToAdmin,
} from "../middlewares/adminMiddleware.js";
import { getAllBuyer, getAllSellers } from "../controllers/authController.js";

const router = express.Router();

// Public routes
router.post("/registerAdmin", registerAdmin);
router.post("/loginAdmin", loginAdmin);
// router.get("/check-auth", isAuthenticated);

// Protected routes
router.use(protectAdmin); // All routes after this middleware are protected

router.post("/logoutAdmin", logoutAdmin);
router.get("/meAdmin", getMeAdmin);
router.get("/buyers", restrictToAdmin("admin", "super-admin"), getAllBuyer);
router.get("/sellers", restrictToAdmin("admin", "super-admin"), getAllSellers);

router.patch("/:sellerId/approve", restrictToAdmin("admin"), approveSeller);
router.patch("/:sellerId/suspend", restrictToAdmin("admin"), suspendSeller);
// Super admin only routes
router.get("/admin-only", restrictToAdmin("super-admin"), (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome super admin!",
  });
});

export default router;
