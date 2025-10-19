// src/pages/Login.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [errorLocal, setErrorLocal] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingLocal(true);
      setErrorLocal("");
      await login(form); // update context
      navigate("/"); // redirect after login
    } catch (err) {
      setErrorLocal(err.response?.data?.message);
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <motion.div
        className="bg-white rounded-2xl p-8 shadow-xl w-96"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
          />

          {errorLocal && (
            <p className="text-red-500 text-sm text-center">{errorLocal}</p>
          )}

          <button
            type="submit"
            disabled={loadingLocal}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            {loadingLocal ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <span
            className="text-indigo-600 cursor-pointer"
            onClick={() => navigate("/auth/register")}
          >
            Register
          </span>
        </p>
      </motion.div>
    </div>
  );
}
