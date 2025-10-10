import React, { useState, useEffect } from "react";
import { FaCheck, FaEdit } from "react-icons/fa";
import { updateProfile } from "../service/AuthService";
import {
  sendVerificationCode,
  verifyCode,
} from "../service/verificationService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileTab = ({ userData, setUserData, updateUser }) => {
  const [verified, setVerified] = useState({ email: false, phone: false });
  const [loading, setLoading] = useState({ email: false, phone: false });
  const [code, setCode] = useState({ email: "", phone: "" });

  useEffect(() => {
    setVerified({
      email: userData?.emailVerified || false,
      phone: userData?.phoneVerified || false,
    });
  }, [userData]);

  // Profile update
  const handleProfileUpdate = async () => {
    try {
      const updatedUser = await updateProfile(userData);
      updateUser(updatedUser);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
  };

  // Send verification code
  const handleSendCode = async (field) => {
    try {
      setLoading({ ...loading, [field]: true });
      await sendVerificationCode(field);
      toast.info(`Verification code sent to your ${field}.`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to send code to ${field}.`);
    } finally {
      setLoading({ ...loading, [field]: false });
    }
  };

  // Verify code
  const handleVerify = async (field) => {
    try {
      setLoading({ ...loading, [field]: true });
      const updatedUser = await verifyCode(field, code[field].toString());

      setVerified({ ...verified, [field]: true });
      setUserData(updatedUser);
      updateUser(updatedUser);

      toast.success(
        `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } verified successfully!`
      );
      setCode({ ...code, [field]: "" });
    } catch (err) {
      console.error(err);
      toast.error(`Invalid code for ${field}.`);
    } finally {
      setLoading({ ...loading, [field]: false });
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Personal Information
        </h3>

        {/* Profile Photo */}
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
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["name", "email", "phone"].map((field) => (
            <div key={field} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-0 ${
                  field === "email" || field === "phone" ? "pr-28" : ""
                }`}
                value={userData[field]}
                onChange={(e) =>
                  setUserData({ ...userData, [field]: e.target.value })
                }
              />

              {/* Verification Inputs */}
              {(field === "email" || field === "phone") && !verified[field] && (
                <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center space-x-1">
                  <input
                    type="text"
                    placeholder="Code"
                    value={code[field]}
                    onChange={(e) =>
                      setCode({ ...code, [field]: e.target.value })
                    }
                    className="px-2 py-1 border border-gray-300 rounded-lg w-16 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      code[field] ? handleVerify(field) : handleSendCode(field)
                    }
                    className="px-3 py-1 rounded-lg text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors"
                    disabled={loading[field]}
                  >
                    {loading[field] ? "..." : code[field] ? "Verify" : "Send"}
                  </button>
                </div>
              )}

              {/* Verified Indicator */}
              {verified[field] && (
                <FaCheck className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 w-5 h-5" />
              )}
            </div>
          ))}

          {/* Join Date */}
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

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button className="px-6 py-2 border border-gray-300 text-gray-700 cursor-pointer rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Cancel
          </button>
          <button
            onClick={handleProfileUpdate}
            className="flex items-center space-x-2 px-6 py-2 bg-[#f9A03f] border border-gray-300 cursor-pointer text-[#fff] rounded-lg hover:bg-[#faa64d] transition-colors font-medium"
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
