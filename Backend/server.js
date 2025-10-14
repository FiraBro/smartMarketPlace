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
// Create HTTP server & Socket.io
// ----------------------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
});

// Socket authentication
io.use(protectSocket);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.user.name}`);

  socket.on("joinChat", (chatId) => {
    socket.join(`chat:${chatId}`);
  });

  socket.on("sendMessage", (message) => {
    io.to(`chat:${message.chatId}`).emit("messageReceived", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Make io accessible in controllers
app.set("io", io);

// ----------------------------
// Start server
// ----------------------------
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
