// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
        quantity: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "paid",
      ],
      default: "pending",
    },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,

    // 🆕 Payment fields
    paymentMethod: {
      type: String,
      enum: ["COD", "TeleBirr"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
