import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaGithub,
  FaGoogle,
  FaStore,
  FaShoppingCart,
  FaUserShield,
} from "react-icons/fa";

export default function AuthPage() {
  const { user, login, register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "buyer", // default role
    store_name: "",
  });
  const [isLogin, setIsLogin] = useState(true);

  // -----------------------------
  // Redirect if already logged in
  // -----------------------------
  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "seller") navigate("/seller/dashboard");
      else navigate("/"); // buyer
    }
  }, [user, loading, navigate]);

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRoleChange = (role) => setForm({ ...form, role });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let loggedInUser;

      if (isLogin) {
        loggedInUser = await login({
          email: form.email,
          password: form.password,
        });
      } else {
        if (form.role === "admin") {
          alert("Admin registration is not allowed.");
          return;
        }
        loggedInUser = await register(form);
      }

      // Redirect based on role
      if (loggedInUser.role === "admin") navigate("/admin");
      else if (loggedInUser.role === "seller") navigate("/seller/dashboard");
      else navigate("/"); // buyer
    } catch (err) {
      alert(
        err.response?.data?.message || err.message || "Something went wrong"
      );
    }
  };

  // -----------------------------
  // Social login handlers
  // -----------------------------
  const continueWithGithub = () => {
    window.location.href = `${import.meta.env.VITE_AUTH_URL}/github`;
  };
  const continueWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_AUTH_URL}/google`;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  if (user) return null; // Prevent rendering form if logged in

  const socialButtonClass =
    "flex items-center justify-center gap-2 w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition";

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
      {/* Left Side */}
      <div className="relative md:w-1/2 w-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white flex flex-col justify-center items-center p-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-3">
            {isLogin ? "Welcome Back!" : "Join Our Marketplace"}
          </h2>
          <p className="text-gray-100 text-sm md:text-base max-w-md mx-auto">
            {isLogin
              ? "Access your account and continue exploring our platform."
              : form.role === "buyer"
              ? "Discover amazing products from local sellers."
              : "Start your business and reach thousands of buyers."}
          </p>
        </motion.div>
      </div>

      {/* Right Side */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col justify-center md:w-1/2 w-full px-5 md:px-10 py-10 md:py-0"
      >
        <div className="max-w-md w-full mx-auto bg-white p-8 md:p-10 rounded-3xl shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center">
            {isLogin ? "Sign In" : "Sign Up"}
          </h2>

          {/* ROLE SELECTION */}
          {!isLogin && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Register as:
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleChange("buyer")}
                  className={`flex items-center justify-center gap-2 p-3 border-2 rounded-xl transition-all ${
                    form.role === "buyer"
                      ? "border-yellow-400 bg-yellow-50 text-yellow-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <FaShoppingCart /> Buyer
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange("seller")}
                  className={`flex items-center justify-center gap-2 p-3 border-2 rounded-xl transition-all ${
                    form.role === "seller"
                      ? "border-green-400 bg-green-50 text-green-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <FaStore /> Seller
                </button>
              </div>
            </div>
          )}

          {/* FORM */}
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
                {form.role === "seller" && (
                  <input
                    type="text"
                    name="store_name"
                    placeholder="Store Name"
                    value={form.store_name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
                  />
                )}
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
              className={`w-full text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition ${
                form.role === "seller"
                  ? "bg-gradient-to-r from-green-400 to-green-600"
                  : "bg-gradient-to-r from-yellow-400 to-yellow-600"
              }`}
            >
              {isLogin
                ? "Sign In"
                : `Sign Up as ${form.role === "seller" ? "Seller" : "Buyer"}`}
            </button>
          </form>

          {/* OAuth */}
          <div className="flex flex-col gap-3 mt-6">
            <button onClick={continueWithGithub} className={socialButtonClass}>
              <FaGithub /> Continue with GitHub
            </button>
            <button onClick={continueWithGoogle} className={socialButtonClass}>
              <FaGoogle /> Continue with Google
            </button>
          </div>

          {/* Toggle Sign In/Sign Up */}
          <div className="text-center mt-6 text-gray-600">
            <p className="text-sm text-gray-500">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  if (!isLogin)
                    setForm((prev) => ({
                      ...prev,
                      role: "buyer",
                      store_name: "",
                    }));
                }}
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
