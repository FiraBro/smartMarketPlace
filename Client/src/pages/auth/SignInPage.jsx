import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function SignInPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Welcome Back 👋
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            Login
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-gray-500">
          Don’t have an account?{" "}
          <Link
            to="/auth/sign-up"
            className="text-[#f9A03f] font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
