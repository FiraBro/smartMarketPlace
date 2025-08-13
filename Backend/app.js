import express from "express";
import cors from "cors";
import path from "path";
import { globalErrorHandler } from "./middlewares/errorMiddleware.js";
import AppError from "./utils/AppError.js";

import authRoutes from "./routes/authRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);

// Handle unhandled routes
// app.all("*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
// });

// Global Error Handler
app.use(globalErrorHandler);

export default app;
