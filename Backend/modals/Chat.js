// models/Chat.js
import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ], // [buyerId, sellerId]
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
    lastMessage: {
      text: String,
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      at: Date,
    },
  },
  { timestamps: true }
);

ChatSchema.index({ participants: 1 });

export default mongoose.model("Chat", ChatSchema);
