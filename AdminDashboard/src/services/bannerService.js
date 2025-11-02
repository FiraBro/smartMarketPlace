import instance from "../utils/axiosInstance";
// ✅ Fetch all banners
export const getBannersService = () => {
  return instance.get("/banners");
};

// ✅ Upload banner
export const uploadBannerService = (formData) => {
  return instance.post("/banners", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
