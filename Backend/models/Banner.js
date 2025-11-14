import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // Cloudinary URL
    imagePublicId: { type: String, required: true }, // Cloudinary public_id for deletion
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
