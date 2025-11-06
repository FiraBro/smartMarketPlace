import mongoose from "mongoose";

const supportMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "read", "replied"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("SupportMessage", supportMessageSchema);
