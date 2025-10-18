import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  shopName: { type: String, required: true },
  logo: { url: String, placeholder: String },
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
