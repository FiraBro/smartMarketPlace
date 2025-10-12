import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaGithub, FaFacebook } from "react-icons/fa";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) await login({ email: form.email, password: form.password });
      else await register(form);
      navigate("/"); // redirect after login/register
    } catch (err) {
      console.error(err);
    }
  };

  const socialButtonClass =
    "flex items-center justify-center gap-2 w-full py-2 border rounded-lg hover:bg-gray-100 transition";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Left side */}
      <div className="relative w-1/2 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white flex flex-col justify-center items-center p-10">
        {/* Curved design */}
        <div className="absolute top-0 right-0 h-full w-32 bg-gray-50 rounded-l-[120px]" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 text-center"
        >
          <h2 className="text-4xl font-bold mb-3">
            {isLogin ? "Welcome Back!" : "Join Our Community"}
          </h2>
          <p className="text-gray-100 max-w-md mx-auto">
            {isLogin
              ? "Access your account and continue exploring our platform."
              : "Create an account and start your journey with us today."}
          </p>
        </motion.div>
      </div>

      {/* Right side form */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col justify-center w-1/2 px-10"
      >
        <div className="max-w-md w-full mx-auto bg-white p-8 rounded-3xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {isLogin ? "Sign In" : "Sign Up"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          {/* Social Login */}
          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={() =>
                (window.location.href = "http://localhost:5000/auth/github")
              }
              className={socialButtonClass}
            >
              <FaGithub /> Continue with GitHub
            </button>
            <button
              onClick={() =>
                (window.location.href = "http://localhost:5000/auth/facebook")
              }
              className={socialButtonClass}
            >
              <FaFacebook /> Continue with Facebook
            </button>
          </div>

          {/* Toggle */}
          <div className="text-center mt-6 text-gray-600">
            <p className="text-sm text-gray-500">
              {isLogin
                ? "Don’t have an account? "
                : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-yellow-500 font-semibold hover:underline ml-1"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
