import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function SignUpPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(form);
    navigate("/auth/sign-in");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Create Your Account 🚀
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#f9A03f] outline-none"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#f9A03f] outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#f9A03f] outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#f9A03f] outline-none"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#f9A03f] to-[#f5a550] text-white py-3 rounded-xl font-semibold shadow-md"
          >
            Register
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link
            to="/auth/sign-in"
            className="text-[#f9A03f] font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
