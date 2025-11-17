import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BANNER_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});

// ✅ Fetch all banners
export const getBannersService = async () => {
  try {
    const response = await api.get("/banners");
    console.log("getBannersService response:", response.data);
    return response.data;
  } catch (err) {
    console.error("getBannersService error:", err);
    throw err;
  }
};

// ✅ Upload banner
export const uploadBannerService = async (formData) => {
  try {
    const response = await api.post("/banners", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("uploadBannerService response:", response.data);
    return response.data;
  } catch (err) {
    console.error("uploadBannerService error:", err);
    throw err;
  }
};
