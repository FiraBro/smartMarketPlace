// routes/favoriteRoutes.js
import express from "express";
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  clearFavorites,
} from "../controllers/favoriteController.js";
import { protect } from "../middlewares/authMiddleware.js";

const favoriteRouter = express.Router();

favoriteRouter.use(protect);

favoriteRouter.get("/", getFavorites);
favoriteRouter.post("/", addToFavorites);
favoriteRouter.delete("/", removeFromFavorites); // ✅ DELETE uses /
favoriteRouter.delete("/clear", clearFavorites);

export default favoriteRouter;
