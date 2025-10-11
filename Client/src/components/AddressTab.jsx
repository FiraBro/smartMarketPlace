import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import AddressModal from "./AddressModal"; // You should create this component

const AddressesTab = ({ addresses, onAdd, onEdit, onDelete, onSetDefault }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleAddClick = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEditClick = (addr) => {
    setEditing(addr);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Saved Addresses</h3>
        <button
          onClick={handleAddClick}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
        >
          <FaPlus />
          <span>Add New Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium text-gray-900">{addr.name}</h4>
              {addr.isDefault && (
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                  Default
                </span>
              )}
            </div>
            <p className="text-gray-600 mb-2">{addr.street}</p>
            <p className="text-gray-600">
              {addr.city}, {addr.state} {addr.zipCode}
            </p>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => handleEditClick(addr)}
                className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
              >
                <FaEdit />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete(addr)}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
              >
                <FaTrash />
                <span>Delete</span>
              </button>
              {!addr.isDefault && (
                <button
                  onClick={() => onSetDefault(addr)}
                  className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
                >
                  <FaCheck />
                  <span>Set as Default</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <AddressModal
          isOpen={modalOpen}
          initialData={editing}
          onSubmit={(data) => {
            if (editing) onEdit(data);
            else onAdd(data);
            setModalOpen(false);
          }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AddressesTab;
