import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-xl shadow-lg">
        <FaExclamationTriangle className="mx-auto text-yellow-500 text-6xl mb-4" />
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          Oops! It looks like you don’t have permission to access this page.
          This might be because you need to log in or your account doesn’t have
          the required role.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          <FaHome className="mr-2" /> Go to Home
        </Link>
        <p className="text-gray-400 mt-4 text-sm">
          If you believe this is a mistake, please contact support.
        </p>
      </div>
    </div>
  );
}
