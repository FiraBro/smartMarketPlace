// src/components/ConnectionStatus.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaWifi, FaPlug, FaSignal } from 'react-icons/fa';

const ConnectionStatus = ({ isConnected }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center mb-4"
    >
      <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
        isConnected 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isConnected ? (
          <>
            <FaWifi className="w-4 h-4" />
            <span>Connected - Real-time updates active</span>
          </>
        ) : (
          <>
            <FaPlug className="w-4 h-4" />
            <span>Disconnected - Real-time updates unavailable</span>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ConnectionStatus;