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

    // Format address
    const address = `${form.fullName}, ${form.phone}, ${form.street}, ${form.city}, ${form.zip}, ${form.country}`;

    // Save to localStorage (or backend API)
    localStorage.setItem("deliveryAddress", address);

    // Redirect back to cart
    navigate(-1);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Delivery Address</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="street"
          value={form.street}
          onChange={handleChange}
          placeholder="Street Address"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="zip"
          value={form.zip}
          onChange={handleChange}
          placeholder="ZIP Code"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="country"
          value={form.country}
          onChange={handleChange}
          placeholder="Country"
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Address
        </button>
      </form>
    </div>
  );
};

export default AddressPage;
