import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

// ---------------------
// ✅ Register
// ✅ Register
export const registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new AppError("User already exists", 400));

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    phone,
  });

  // Store user in session (use _id!)
  req.session.user = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  res.status(201).json({
    message: "User registered successfully",
    user: req.session.user,
  });
});

// ✅ Login
export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new AppError("Invalid credentials", 400));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new AppError("Invalid credentials", 400));

  // Store user in session (use _id!)
  req.session.user = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  res.json({
    message: "Login successful",
    user: req.session.user,
  });
});

// ---------------------
// ✅ Get current user
// ---------------------
export const getMe = catchAsync(async (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  res.json({ user: req.session.user });
});

// ---------------------
// ✅ Update Profile
// ---------------------
export const updateMe = catchAsync(async (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const { name, email, password, phone } = req.body;
  const updates = {};

  if (name) updates.name = name;
  if (email) updates.email = email;
  if (phone) updates.phone = phone;
  if (password) updates.password = await bcrypt.hash(password, 10);

  const updatedUser = await User.findByIdAndUpdate(
    req.session.user._id,
    updates,
    { new: true, runValidators: true }
  );

  // Update session user
  req.session.user = {
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  };

  res.json({
    message: "Profile updated successfully",
    user: req.session.user,
  });
});

// ---------------------
// ✅ Logout
// ---------------------
export const logoutUser = catchAsync(async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(new AppError("Logout failed", 500));
    res.clearCookie("connect.sid"); // Clear session cookie
    res.json({ message: "Logged out successfully" });
  });
});

// ✅ check login status
export const checkAuth = catchAsync(async (req, res) => {
  if (req.session === undefined) {
    return res.json({ loggedIn: false });
  }
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});
