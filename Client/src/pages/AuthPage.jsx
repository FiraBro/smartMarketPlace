import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
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
    try {
      if (isLogin) {
        await login({ email: form.email, password: form.password });
      } else {
        await register({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        });
      }
      navigate("/"); // redirect after login/register
    } catch (error) {
      console.error(error);
    }
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-50 px-4"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h2>
          <Link
            to="/"
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <FaTimes className="w-5 h-5 text-gray-600" />
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-[#f9A03f] focus:outline-none transition"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-[#f9A03f] focus:outline-none transition"
                required
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-200 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-[#f9A03f] focus:outline-none transition"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-200 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-[#f9A03f] focus:outline-none transition"
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#f9A03f] to-[#f5a550] text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* Toggle */}
        <p className="mt-5 text-sm text-center text-gray-500">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#f9A03f] font-semibold hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </motion.div>
  );
}
