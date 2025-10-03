// models/Message.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, trim: true },
    // optional: files/attachments later
  },
  { timestamps: true }
);

MessageSchema.index({ chat: 1, createdAt: -1 });

export default mongoose.model("Message", MessageSchema);
