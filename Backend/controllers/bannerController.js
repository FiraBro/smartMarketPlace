// controllers/bannerController.js
import Banner from "../models/Banner.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import fs from "fs";
import path from "path";

export const uploadBanner = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Please upload an image", 400));
  }

  // Get all banners (sorted by oldest first)
  const banners = await Banner.find().sort({ createdAt: 1 });

  // If already 5, remove the oldest
  if (banners.length >= 5) {
    const oldest = banners[0];

    // Delete file from uploads directory
    if (oldest.image) {
      const oldPath = path.join(process.cwd(), oldest.image);
      fs.unlink(oldPath, (err) => {
        if (err) console.error("Error deleting old banner:", err);
      });
    }

    // Remove from DB
    await Banner.findByIdAndDelete(oldest._id);
  }

  // Save new banner to DB
  const newBanner = await Banner.create({
    image: `uploads/${req.file.filename}`, // relative path
  });

  res.status(201).json({
    status: "success",
    data: {
      banner: newBanner,
    },
  });
});

// ✅ New: Fetch all banners
export const getBanners = catchAsync(async (req, res, next) => {
  const banners = await Banner.find().sort({ createdAt: -1 }); // newest first

  res.status(200).json({
    status: "success",
    results: banners.length,
    data: {
      banners,
    },
  });
});
