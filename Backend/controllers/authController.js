import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { generateToken } from "../utils/generateToken.js";

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

  const token = generateToken(user._id);

  res.status(201).json({
    message: "User registered successfully",
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// ✅ Login
export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new AppError("Invalid credentials", 400));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new AppError("Invalid credentials", 400));

  const token = generateToken(user._id);

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

// ✅ Get Me
export const getMe = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  res.json({ user: req.user });
});

// ✅ Update Profile
export const updateMe = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const { name, email, password, phone } = req.body;
  const updates = {};

  if (name) updates.name = name;
  if (email) updates.email = email;
  if (phone) updates.phone = phone;
  if (password) {
    updates.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({
    message: "Profile updated successfully",
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    },
  });
});
