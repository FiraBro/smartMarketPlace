// routes/metrics.routes.js
import { Router } from "express";
import {
  trackView,
  getPopularProducts,
  getTopSellingProducts,
  getNewProducts,
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

// GET most sold products
router.get(
  "/most-sold",
  cacheTTL(() => `home:most-sold`, 2 * 60_000),
  getTopSellingProducts
);

// GET new products
router.get(
  "/new",
  cacheTTL(() => `home:new-products`, 2 * 60_000),
  getNewProducts
);

// Track a product view
router.post("/view/:productId", trackView);

export default router;
