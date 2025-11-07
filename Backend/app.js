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
import supportRoutes from "./routes/supportRoutes.js";

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
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/listings", listingRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/metrics", matricsRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/banners", bannerRoutes);
app.use("/api/v1/favorites", favoriteRouter);
app.use("/api/v1/newsletter", newsLetter);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/verify", verificationRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/support", supportRoutes);

// Seller routes (banner & logo upload handled with multer inside the route)
app.use("/api/seller", sellerRoutes);

// ----------------------------
// Global Error Handler
// ----------------------------
app.use(globalErrorHandler);

export default app;
