import Admin from "../models/Admin.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

// Register admin
export const register = catchAsync(async (req, res, next) => {
  const { username, email, password, passwordConfirm, role } = req.body;

  // Check if password matches confirmation
  if (password !== passwordConfirm) {
    return next(new AppError("Passwords do not match", 400));
  }

  // Check if admin already exists
  const existingAdmin = await Admin.findOne({
    $or: [{ email }, { username }],
  });

  if (existingAdmin) {
    return next(
      new AppError("Admin with this email or username already exists", 400)
    );
  }

  // Create new admin
  const newAdmin = await Admin.create({
    username,
    email,
    password,
    role: role || "admin",
  });

  // Remove password from output
  newAdmin.password = undefined;

  res.status(201).json({
    status: "success",
    message: "Admin registered successfully",
    data: {
      admin: newAdmin,
    },
  });
});

// Login admin
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // 2) Check if admin exists and password is correct
  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin || !(await admin.correctPassword(password, admin.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) Check if admin is active
  if (!admin.isActive) {
    return next(new AppError("Your account has been deactivated", 401));
  }

  // 4) Set session
  req.session.admin = {
    id: admin._id,
    username: admin.username,
    email: admin.email,
    role: admin.role,
  };

  // Remove password from output
  admin.password = undefined;

  res.status(200).json({
    status: "success",
    message: "Logged in successfully",
    data: {
      admin,
    },
  });
});

// Logout admin
export const logout = catchAsync(async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(new AppError("Could not log out", 500));
    }

    res.clearCookie("connect.sid");
    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  });
});

// Get current admin
export const getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      admin: req.session.admin,
    },
  });
});
