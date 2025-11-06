import React, { useRef, useState} from "react";
import { FaCheck, FaEdit } from "react-icons/fa";
import { updateProfile } from "../service/AuthService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileTab = ({ userData, setUserData, updateUser }) => {
  const fileInputRef = useRef(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImageFile(file);
    const imageURL = URL.createObjectURL(file);
    setUserData({ ...userData, avatar: imageURL });
  };

  // Save profile (with image)
  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      formData.append("phone", userData.phone);
      if (selectedImageFile) formData.append("avatar", selectedImageFile);

      const updatedUser = await updateProfile(formData); // FormData is detected
      updateUser(updatedUser);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Personal Information
        </h3>

        {/* Profile Photo */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
          <img
            className="h-20 w-20 rounded-full object-cover border border-gray-200"
            src={userData.avatar}
            alt="Profile"
          />

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

        <button
  type="button"
  onClick={() => fileInputRef.current.click()}
  className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
>
  <FaEdit className="w-4 h-4" />
</button>

      </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["name", "email", "phone"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                value={userData[field]}
                onChange={(e) =>
                  setUserData({ ...userData, [field]: e.target.value })
                }
              />
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleProfileUpdate}
            className="flex items-center space-x-2 px-6 py-2 bg-[#f9A03f] text-white rounded-lg hover:bg-[#faa64d] transition-colors font-medium"
          >
            <FaCheck className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
