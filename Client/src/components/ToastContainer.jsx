// src/components/ToastContainer.jsx
import React from 'react';
import { ToastContainer } from 'react-toastify';

const CustomToastContainer = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastClassName="rounded-xl shadow-lg"
      progressClassName="bg-gradient-to-r from-blue-500 to-blue-600"
    />
  );
};

export default CustomToastContainer;