import express from "express";
import cors from "cors";
import path from "path";
import passport from "./config/passport.js";
import { sessionConfig } from "./config/session.js";
import { globalErrorHandler } from "./middlewares/errorMiddleware.js";

// Route imports
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
import verificationRoutes from "./routes/verificationRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// ----------------------------
// Middleware
// ----------------------------
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Set JSON and URL-encoded body size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ----------------------------
// Session and Passport
// ----------------------------
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

// ----------------------------
// Routes
// ----------------------------
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
app.use("/api/addresses", addressRoutes);
app.use("/api/verify", verificationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// Seller routes (banner & logo upload handled with multer inside the route)
app.use("/api/seller", sellerRoutes);

// ----------------------------
// Global Error Handler
// ----------------------------
app.use(globalErrorHandler);

export default app;
