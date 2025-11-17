// src/controllers/authController.js
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import Admin from "../models/Admin.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

// ---------------------
// Helper: create session object
// ---------------------
const createSessionUser = (user) => ({
  _id: user._id,
  name: user.name || user.username || "Admin",
  email: user.email,
  role: user.role || "buyer",
  avatar: user.avatar || null,
});

// ---------------------
// Register (user/admin)
// ---------------------
export const registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role, phone } = req.body;

  if (role === "admin") {
    // ⚠️ Only allow admin registration if authorized (optional)
    if (password !== passwordConfirm)
      return next(new AppError("Passwords do not match", 400));

    const existing = await Admin.findOne({ email });
    if (existing) return next(new AppError("Admin already exists", 400));

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      email,
      password: hashedPassword,
      role: "admin",
    });

    req.session.user = createSessionUser(admin);

    return res.status(201).json({
      status: "success",
      message: "Admin registered successfully",
      user: req.session.user,
    });
  }

  // Normal user (buyer/seller)
  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new AppError("User already exists", 400));

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashed,
    role: role || "buyer",
    phone,
  });

  req.session.user = createSessionUser(user);

  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    user: req.session.user,
  });
});

// ---------------------
// Login (user/admin)
// ---------------------
export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1️⃣ Try admin login
  let admin = await Admin.findOne({ email }).select("+password");
  if (admin) {
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return next(new AppError("Invalid credentials", 400));

    req.session.user = createSessionUser(admin);

    return res.json({
      status: "success",
      message: "Admin logged in successfully",
      user: req.session.user,
    });
  }

  // 2️⃣ Try normal user login
  let user = await User.findOne({ email }).select("+password");
  if (!user) return next(new AppError("Invalid credentials", 400));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new AppError("Invalid credentials", 400));

  req.session.user = createSessionUser(user);

  res.json({
    status: "success",
    message: "Login successful",
    user: req.session.user,
  });
});

// ---------------------
// Get current user
// ---------------------
export const getMe = catchAsync(async (req, res, next) => {
  if (!req.session.user)
    return res.status(401).json({ message: "Not authorized" });

  res.json({ user: req.session.user });
});

// ---------------------
// Update Profile
// ---------------------
export const updateMe = catchAsync(async (req, res, next) => {
  if (!req.session.user)
    return res.status(401).json({ message: "Not authorized" });

  const { name, email, password, phone } = req.body;
  const updates = {};

  if (name) updates.name = name;
  if (email) updates.email = email;
  if (phone) updates.phone = phone;
  if (password) updates.password = await bcrypt.hash(password, 10);

  // Handle uploaded avatar
  if (req.file) updates.avatar = `/uploads/${req.file.filename}`;

  // Choose correct model
  const Model = req.session.user.role === "admin" ? Admin : User;
  const updatedUser = await Model.findByIdAndUpdate(
    req.session.user._id,
    updates,
    { new: true, runValidators: true }
  );

  req.session.user = createSessionUser(updatedUser);

  res.json({
    status: "success",
    message: "Profile updated successfully",
    user: req.session.user,
  });
});

// ---------------------
// Logout
// ---------------------
export const logoutUser = catchAsync(async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(new AppError("Logout failed", 500));
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

// ---------------------
// Check auth status
// ---------------------
export const checkAuth = catchAsync(async (req, res) => {
  if (req.session?.user) {
    return res.json({ loggedIn: true, user: req.session.user });
  }
  res.json({ loggedIn: false });
});

export const getAllSellers = catchAsync(async (req, res, next) => {
  // Fetch all users with role 'seller'
  const sellers = await User.find({ role: "seller" });

  res.status(200).json({
    status: "success",
    results: sellers.length,
    data: {
      sellers,
    },
  });
});
export const getAllBuyer = catchAsync(async (req, res, next) => {
  // Fetch all users
  const users = await User.find({ role: "buyer" });

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});
