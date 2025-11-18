import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCloudUploadAlt, FaImage } from "react-icons/fa";
import {
  getBannersService,
  uploadBannerService,
} from "../../service/adminBannerService";

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBanners = async () => {
    try {
      const res = await getBannersService();
      console.log(res.data);
      setBanners(res.data.data.banners);
    } catch (error) {
      console.log("Error fetching banners", error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadBanner = async () => {
    if (!selectedFile) return alert("Please select an image");

    const formData = new FormData();
    formData.append("banner", selectedFile);

    setLoading(true);
    try {
      await uploadBannerService(formData);
      setSelectedFile(null);
      setPreview(null);
      fetchBanners();
    } catch (err) {
      alert("Upload failed");
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f9A03f] bg-opacity-10 rounded-full mb-4">
          <FaImage className="text-2xl text-[#f9A03f]" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Banner Management
        </h2>
        <p className="text-gray-600">Upload and manage your banner images</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <label className="cursor-pointer w-full md:w-1/2 border-2 border-dashed border-gray-200 rounded-2xl p-8 hover:border-[#f9A03f] transition-all duration-300 bg-gray-50 hover:bg-orange-50">
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="flex flex-col justify-center items-center text-gray-500">
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-[#f9A03f] bg-opacity-10 rounded-full flex items-center justify-center">
                  <FaCloudUploadAlt size={28} className="text-[#f9A03f]" />
                </div>
              </div>
              <p className="text-lg font-medium mb-1">Upload Banner Image</p>
              <p className="text-sm text-gray-400 text-center">
                Click to browse or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-2">
                PNG, JPG, JPEG (Max 5MB)
              </p>
            </div>
          </label>

          {preview && (
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-64 h-40 rounded-xl object-cover shadow-lg border-2 border-[#f9A03f] border-opacity-30"
                />
                <div className="absolute -top-2 -right-2 bg-[#f9A03f] text-white text-xs px-2 py-1 rounded-full font-medium">
                  Preview
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={uploadBanner}
          disabled={loading || !selectedFile}
          className="mt-6 w-full bg-[#f9A03f] hover:bg-[#e89138] text-white font-semibold py-3.5 rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Uploading...
            </>
          ) : (
            "Upload Banner"
          )}
        </button>
      </div>

      {/* Current Banners Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-[#f9A03f] rounded-full"></div>
          <h3 className="text-2xl font-semibold text-gray-800">
            Current Banners
          </h3>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
            {banners.length} / 5
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {banners.map((banner, index) => (
            <motion.div
              key={banner._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="relative overflow-hidden rounded-xl shadow-md group-hover:shadow-xl transition-all duration-300">
                <img
                  src={`http://localhost:5000/${banner.image}`}
                  alt="Banner"
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="absolute top-3 left-3 bg-[#f9A03f] text-white px-3 py-1 text-sm rounded-full font-medium shadow-lg">
                #{index + 1}
              </div>
            </motion.div>
          ))}
        </div>

        {banners.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaImage className="text-3xl text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No banners uploaded yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Upload your first banner to get started
            </p>
          </div>
        )}

        {banners.length === 5 && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-amber-800 text-sm text-center flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              Maximum banners reached. Uploading a new one will remove the
              oldest automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerManager;
