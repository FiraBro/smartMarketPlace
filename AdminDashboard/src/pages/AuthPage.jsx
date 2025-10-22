import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/authService";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  // Shared state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    role: "admin",
  });

  // Handlers
  const handleLoginChange = (e) =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  const handleRegisterChange = (e) =>
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });

  // Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await login(loginForm);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Submit Register
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (registerForm.password !== registerForm.passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await registerUser(registerForm);
      setIsLogin(true); // switch to login after success
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <motion.div
        key={isLogin ? "login" : "register"}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl p-8 shadow-xl w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          {isLogin ? "Admin Login" : "Admin Registration"}
        </h2>

        {/* LOGIN FORM */}
        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={handleLoginChange}
              required
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={handleLoginChange}
              required
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="mt-4 text-center text-sm">
              Don’t have an account?{" "}
              <span
                className="text-indigo-600 cursor-pointer"
                onClick={() => setIsLogin(false)}
              >
                Register
              </span>
            </p>
          </form>
        ) : (
          // REGISTER FORM
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={registerForm.name}
              onChange={handleRegisterChange}
              required
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={handleRegisterChange}
              required
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={handleRegisterChange}
              required
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              name="passwordConfirm"
              placeholder="Confirm Password"
              value={registerForm.passwordConfirm}
              onChange={handleRegisterChange}
              required
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone (optional)"
              value={registerForm.phone}
              onChange={handleRegisterChange}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                value={registerForm.role}
                onChange={handleRegisterChange}
                className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
                disabled
              >
                <option value="admin">Admin</option>
              </select>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md transition text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <span
                className="text-indigo-600 cursor-pointer"
                onClick={() => setIsLogin(true)}
              >
                Login
              </span>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
}
