import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddressPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    zip: "",
    country: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const address = `${form.fullName}, ${form.phone}, ${form.street}, ${form.city}, ${form.zip}, ${form.country}`;
    localStorage.setItem("deliveryAddress", address);

    navigate(-1); // go back to cart
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Delivery Address
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg p-3"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 234 567 890"
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg p-3"
              required
            />
          </div>

          {/* Street */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Street Address
            </label>
            <input
              type="text"
              name="street"
              value={form.street}
              onChange={handleChange}
              placeholder="123 Main St"
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg p-3"
              required
            />
          </div>

          {/* City & Zip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="New York"
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg p-3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                name="zip"
                value={form.zip}
                onChange={handleChange}
                placeholder="10001"
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg p-3"
                required
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="United States"
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg p-3"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-1/2 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-3 bg-amber-600 text-white font-semibold rounded-lg shadow hover:bg-amber-500 transition cursor-pointer"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressPage;
