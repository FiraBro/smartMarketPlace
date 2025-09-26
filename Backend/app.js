import express from "express";
import cors from "cors";
import path from "path";
import { globalErrorHandler } from "./middlewares/errorMiddleware.js";
import AppError from "./utils/AppError.js";

import authRoutes from "./routes/authRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import matricsRoutes from "./routes/matricsRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import favoriteRouter from "./routes/favoriteRoutes.js";
import newsLetter from "./routes/newsLetterRoutes.js";
import paymentRoutes from "./routes/pamentRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/metrics", matricsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/favorites", favoriteRouter);
app.use("/api/newsletter", newsLetter);
app.use("/api/payments", paymentRoutes);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
