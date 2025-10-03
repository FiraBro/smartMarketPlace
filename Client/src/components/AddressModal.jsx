import React, { useState } from "react";
import { createAddress } from "../service/addressService";

const AddressModal = ({ onSave, onCancel }) => {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update form correctly
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const savedAddress = await createAddress(form);
      if (onSave) onSave(savedAddress);
    } catch (err) {
      console.error(err);
      setError("Failed to save address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onCancel} // clicking outside closes modal
    >
      <div
        className="bg-white p-6 rounded-xl max-w-md w-full z-60"
        onClick={(e) => e.stopPropagation()} // prevent modal click from closing
      >
        <h2 className="text-xl font-bold mb-4">Add Delivery Address</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="street"
            placeholder="Street"
            value={form.street}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-amber-600 text-white rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
