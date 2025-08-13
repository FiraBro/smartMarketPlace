import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, required: true, maxlength: 5000 },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, index: true },
    condition: {
      type: String,
      enum: ["new", "like-new", "used", "for-parts"],
      default: "used",
    },
    location: { type: String },
    images: { type: [String], default: [] }, // store file paths
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

ListingSchema.index({ title: "text", description: "text" });

export default mongoose.model("Listing", ListingSchema);
