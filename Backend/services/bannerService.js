import Banner from "../models/Banner.js";
import cloudinary from "../utils/cloudinary.js";
import AppError from "../utils/AppError.js";

/**
 * Upload a new banner and delete oldest if there are already 5
 */
export const uploadBannerService = async (file) => {
  if (!file) throw new AppError("Please upload an image", 400);

  // Delete oldest banner if more than 5
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
    image: file.path || file.url,
    imagePublicId: file.filename || file.public_id,
  });

  return newBanner;
};

/**
 * Get all banners, newest first
 */
export const getBannersService = async () => {
  return await Banner.find().sort({ createdAt: -1 });
};
