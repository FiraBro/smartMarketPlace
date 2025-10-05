import React from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaHome } from "react-icons/fa";

const AddressesTab = ({ addresses }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Saved Addresses</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium">
          <FaPlus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => {
          const Icon = addr.icon || FaHome;
          return (
            <div
              key={addr.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-gray-400" />
                  <h4 className="font-medium text-gray-900">{addr.name}</h4>
                </div>
                {addr.isDefault && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Default
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-2">{addr.street}</p>
              <p className="text-gray-600">
                {addr.city}, {addr.state} {addr.zipCode}
              </p>
              <div className="flex space-x-3 mt-4">
                <button className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium">
                  <FaEdit className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium">
                  <FaTrash className="w-3 h-3" />
                  <span>Delete</span>
                </button>
                {!addr.isDefault && (
                  <button className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium">
                    <FaCheck className="w-3 h-3" />
                    <span>Set as Default</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddressesTab;
