import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  shopName: { type: String, required: true },

  // Store Cloudinary info instead of plain string
  banner: {
    url: { type: String, default: null },
    public_id: { type: String, default: null },
  },
  logo: {
    url: { type: String, default: null },
    public_id: { type: String, default: null },
  },

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
