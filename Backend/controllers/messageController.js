import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import { getIO } from "../socket/io.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

// Get messages in a chat (paginated)
export const getChatMessages = catchAsync(async (req, res, next) => {
  const { chatId } = req.params;
  const { page = 1, limit = 30 } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const pageSize = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * pageSize;

  const [items, total] = await Promise.all([
    Message.find({ chat: chatId })
      .sort("createdAt")
      .skip(skip)
      .limit(pageSize)
      .lean(),
    Message.countDocuments({ chat: chatId }),
  ]);

  res.status(200).json({
    page: pageNum,
    limit: pageSize,
    total,
    totalPages: Math.ceil(total / pageSize) || 1,
    items,
  });
});

// Send a message + broadcast via Socket.IO
export const sendMessage = catchAsync(async (req, res, next) => {
  const { chatId } = req.params;
  const { text } = req.body;
  const sender = req.user._id;

  if (!text || !text.trim()) {
    return next(new AppError("Text is required", 400));
  }

  const chat = await Chat.findById(chatId);
  if (!chat) return next(new AppError("Chat not found", 404));

  const isMember = chat.participants.some(
    (id) => String(id) === String(sender)
  );
  if (!isMember)
    return next(new AppError("Not a participant of this chat", 403));

  const msg = await Message.create({ chat: chatId, sender, text: text.trim() });

  // Update last message in chat
  chat.lastMessage = { text: text.slice(0, 200), sender, at: new Date() };
  await chat.save();

  // Broadcast via Socket.IO
  const io = getIO();
  io.to(`chat:${chatId}`).emit("message:new", {
    _id: msg._id,
    chat: chatId,
    sender,
    text: msg.text,
    createdAt: msg.createdAt,
  });

  res.status(201).json(msg);
});
