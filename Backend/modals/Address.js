// models/Address.js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: { type: String, required: true }, // e.g., John Doe
    street: { type: String, required: true },
    state: { type: String },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Address", addressSchema);
