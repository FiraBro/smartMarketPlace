import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import app from "./app.js";
import { protectSocket } from "./middlewares/socketAuthMiddleware.js";
import { sessionConfig } from "./config/session.js"; // your session import
import { seedFirstAdmin } from "./utils/seedFirstAdmin.js";
// ----------------------------
// Connect to MongoDB
// ----------------------------
await connectDB(); // make sure connectDB returns a promise

// ----------------------------
// Seed first admin if none exists
// ----------------------------
await seedFirstAdmin(); // ✅ creates default admin automatically

// ----------------------------
// Create HTTP server
// ----------------------------
const server = http.createServer(app);

// ----------------------------
// Socket.io setup
// ----------------------------
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

// ----------------------------
// Share session with Socket.IO
// ----------------------------
io.use((socket, next) => {
  sessionConfig(socket.request, {}, next);
});

// Socket authentication
io.use(protectSocket);

io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.user.name} (${socket.user._id})`);
  socket.join(`notifications:${socket.user._id}`);
  console.log(`User ${socket.user._id} joined notifications room`);

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.user.name}`);
  });
});

// Make io accessible in controllers
app.set("io", io);

// ----------------------------
// Start server
// ----------------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
