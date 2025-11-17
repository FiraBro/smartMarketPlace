// controllers/bannerController.js
import Banner from "../models/Banner.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import cloudinary from "../utils/cloudinary.js";

export const uploadBanner = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Please upload an image", 400));
  }

  // Delete oldest if already 5 banners
  const banners = await Banner.find().sort({ createdAt: 1 });
  if (banners.length >= 5) {
    const oldest = banners[0];

    if (oldest.imagePublicId) {
      await cloudinary.uploader.destroy(oldest.imagePublicId);
    }

    await Banner.findByIdAndDelete(oldest._id);
  }

  // Save new banner
  const newBanner = await Banner.create({
    image: req.file.path || req.file.url, // URL to image
    imagePublicId: req.file.filename || req.file.public_id, // for deletion
  });

  res.status(201).json({
    status: "success",
    data: {
      banner: newBanner,
    },
  });
});

// Fetch all banners
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
