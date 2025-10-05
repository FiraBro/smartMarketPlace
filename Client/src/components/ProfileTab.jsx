import React from "react";
import { FaCheck, FaEdit } from "react-icons/fa";
import { updateProfile } from "../service/AuthService";

const ProfileTab = ({ userData, setUserData, updateUser }) => {
  const handleProfileUpdate = async () => {
    try {
      const updatedUser = await updateProfile(userData);
      updateUser(updatedUser); // update context
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Personal Information
        </h3>

        <div className="flex items-center space-x-6 mb-6">
          <img
            className="h-20 w-20 rounded-full object-cover border-2 border-primary-500"
            src={userData.avatar}
            alt="Profile"
          />
          <div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium">
              <FaEdit className="w-4 h-4" />
              <span>Change Photo</span>
            </button>
            <p className="text-sm text-gray-500 mt-2">{userData.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["name", "email", "phone"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
                value={userData[field]}
                onChange={(e) =>
                  setUserData({ ...userData, [field]: e.target.value })
                }
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member Since
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              value={userData.joinDate}
              disabled
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button className="px-6 py-2 border border-gray-300 text-gray-700 cursor-pointer rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Cancel
          </button>
          <button
            onClick={handleProfileUpdate}
            className="flex items-center space-x-2 px-6 py-2 bg-primary-500 border border-gray-300 cursor-pointer text-gray-700 rounded-lg hover:bg-primary-600 transition-colors font-medium"
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
