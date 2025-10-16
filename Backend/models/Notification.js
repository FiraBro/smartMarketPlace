import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    recipientType: {
      type: String,
      enum: ["all", "seller", "buyer"],
      required: true,
    },
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    channel: { type: String, enum: ["email", "in-app", "sms"], required: true },
    type: { type: String, enum: ["info", "alert", "reminder"], required: true },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
