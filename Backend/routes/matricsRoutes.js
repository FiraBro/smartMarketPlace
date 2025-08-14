// routes/metrics.routes.js
import { Router } from "express";
import {
  trackView,
  getPopularProducts,
} from "../controllers/matricsController.js";
import { cacheTTL } from "../middlewares/cacheTTL.js";

const router = Router();

// GET popular products
router.get(
  "/popular",
  cacheTTL(
    (req) => `home:popular:${req.query.days || 30}:${req.query.limit || 12}`,
    2 * 60_000
  ),
  getPopularProducts
);

// Track a product view
router.post("/view/:productId", trackView);

export default router;
