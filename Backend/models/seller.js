import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  shopName: { type: String, required: true },
  banner: { type: String, default: null }, // URL/path to banner image
  logo: { type: String, default: null },
  contact: { type: String },
  description: String,
  address: String,
  bankAccount: { type: String },
  payoutMethod: { type: String, default: "bank" },
  status: {
    type: String,
    enum: ["pending", "approved", "suspended"],
    default: "pending",
  },

  createdAt: { type: Date, default: Date.now },
});

// ✅ Prevent OverwriteModelError
const Seller = mongoose.models.Seller || mongoose.model("Seller", sellerSchema);

export default Seller;
