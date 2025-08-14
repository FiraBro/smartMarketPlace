// models/order.model.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
        quantity: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
