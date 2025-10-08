import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    shopName: { type: String, required: true },
    logo: { url: String, placeholder: String },
    description: { type: String },
    contact: { type: String },
    bankAccount: { type: String },
    payoutMethod: { type: String, default: "bank" },
  },
  { timestamps: true }
);

export default mongoose.model("Seller", sellerSchema);
