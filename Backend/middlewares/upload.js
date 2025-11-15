import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
// import cloudinary from "../utils/cloudinary";
import cloudinary from "../utils/cloudinary.js";
const storage = new CloudinaryStorage({
  cloudinary, // shorthand, same as cloudinary: cloudinary
  params: (req, file) => {
    // Dynamically choose folder based on route or file type
    let folder = "smartmarketplace";
    if (file.fieldname === "banner") folder = "smartmarketplace/banners";
    if (file.fieldname === "product") folder = "smartmarketplace/products";
    return {
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "avif", "mp4"],
    };
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max
    files: 10, // max 10 files per request
  },
});
