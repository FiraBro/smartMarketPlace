import catchAsync from "../utils/catchAsync.js";
import * as bannerService from "../services/bannerService.js";

// ✅ Upload banner
export const uploadBanner = catchAsync(async (req, res, next) => {
  const banner = await bannerService.uploadBannerService(req.file);

  res.status(201).json({
    status: "success",
    data: { banner },
  });
});

// ✅ Get all banners
export const getBanners = catchAsync(async (req, res, next) => {
  const banners = await bannerService.getBannersService();

  res.status(200).json({
    status: "success",
    results: banners.length,
    data: { banners },
  });
});
