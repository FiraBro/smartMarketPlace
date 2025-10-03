// routes/address.routes.js
import express from "express";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";
import { protect } from "../middlewares/authMiddleware.js";
const addressRoutes = express.Router();

addressRoutes.get("/", protect, getAddresses);
addressRoutes.post("/", protect, createAddress);
addressRoutes.put("/:id", protect, updateAddress);
addressRoutes.delete("/:id", protect, deleteAddress);

export default addressRoutes;
