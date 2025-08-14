// models/banner.model.js
import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    images: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);
