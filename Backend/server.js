import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import app from "./app.js";
import { protectSocket } from "./middlewares/socketAuthMiddleware.js";

// ----------------------------
// Connect to MongoDB
// ----------------------------
connectDB();

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

// Socket authentication
io.use(protectSocket);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.user.name}`);

  // ----------------------------
  // Chat rooms
  // ----------------------------
  socket.on("joinChat", (chatId) => {
    socket.join(`chat:${chatId}`);
  });

  socket.on("sendMessage", (message) => {
    io.to(`chat:${message.chatId}`).emit("messageReceived", message);
  });

  // ----------------------------
  // Notifications
  // ----------------------------
  // Join a personal notification room
  socket.join(`notifications:${socket.user._id}`);

  // Optional manual emit
  socket.on("sendNotification", (notification) => {
    io.to(`notifications:${socket.user._id}`).emit(
      "notification",
      notification
    );
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.user.name}`);
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
