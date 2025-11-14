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
    location: { type: String, required: true },

    // ✅ Store Cloudinary info
    images: [
      {
        url: { type: String, required: true }, // Cloudinary URL
        placeholder: { type: String }, // Base64 blur placeholder (optional)
        public_id: { type: String }, // Cloudinary public_id for deletion
      },
    ],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stock: { type: Number, default: 0, min: 0 },
    sizes: [String],
    isPopular: { type: Boolean, default: false },
    isMostSold: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Full-text search on title and description
ListingSchema.index({ title: "text", description: "text" });

export default mongoose.model("Listing", ListingSchema);
