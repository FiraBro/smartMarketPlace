import React from "react";
import {
  FaBell,
  FaShieldAlt,
  FaCreditCard,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SettingTab = ({ logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clear user state
    navigate("/"); // redirect to homepage
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Account Settings
        </h3>

        <div className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <FaBell className="h-5 w-5 text-gray-400" />
              <div>
                <h4 className="font-medium text-gray-900">
                  Email Notifications
                </h4>
                <p className="text-sm text-gray-500">
                  Receive updates about orders and promotions
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <FaShieldAlt className="h-5 w-5 text-gray-400" />
              <div>
                <h4 className="font-medium text-gray-900">
                  Two-Factor Authentication
                </h4>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              <FaShieldAlt className="w-4 h-4" />
              <span>Enable</span>
            </button>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <FaCreditCard className="h-5 w-5 text-gray-400" />
              <div>
                <h4 className="font-medium text-gray-900">Payment Methods</h4>
                <p className="text-sm text-gray-500">
                  Manage your saved payment methods
                </p>
              </div>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium">
              <FaCreditCard className="w-4 h-4" />
              <span>Manage</span>
            </button>
          </div>

          {/* Logout */}
          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-6 py-2 bg-gray-50 text-black rounded-lg hover:cursor-pointer transition-colors font-medium"
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingTab;
