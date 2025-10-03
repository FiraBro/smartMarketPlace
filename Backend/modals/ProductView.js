// models/productView.model.js
import mongoose from "mongoose";

const productViewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("ProductView", productViewSchema);
