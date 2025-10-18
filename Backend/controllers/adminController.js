import Admin from "../models/Admin.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import Seller from "../models/Seller.js";

// Register admin
export const registerAdmin = catchAsync(async (req, res, next) => {
  const { email, password, passwordConfirm, role } = req.body;

  // Check if password matches confirmation
  if (password !== passwordConfirm) {
    return next(new AppError("Passwords do not match", 400));
  }

  // Check if admin already exists
  const existingAdmin = await Admin.findOne({
    $or: [{ email }],
  });

  if (existingAdmin) {
    return next(
      new AppError("Admin with this email or username already exists", 400)
    );
  }

  // Create new admin
  const newAdmin = await Admin.create({
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
export const loginAdmin = catchAsync(async (req, res, next) => {
  // console.log(req.session);
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
export const logoutAdmin = catchAsync(async (req, res, next) => {
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
export const getMeAdmin = catchAsync(async (req, res, next) => {
  console.log("Session in getMeAdmin:", req.session);

  if (!req.session.admin) {
    return res.status(401).json({
      status: "fail",
      message: "Not authorized — no admin session",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      admin: req.session.admin,
    },
  });
});

export const approveSeller = catchAsync(async (req, res, next) => {
  const { sellerId } = req.params;

  const seller = await Seller.findById(sellerId);
  if (!seller) return next(new AppError("Seller not found", 404));

  seller.status = "approved";
  await seller.save();

  res.status(200).json({
    status: "success",
    message: "Seller approved successfully",
    data: seller,
  });
});
export const suspendSeller = catchAsync(async (req, res, next) => {
  const { sellerId } = req.params;

  const seller = await Seller.findById(sellerId);
  if (!seller) return next(new AppError("Seller not found", 404));

  seller.status = "suspended";
  await seller.save();

  res.status(200).json({
    status: "success",
    message: "Seller suspended successfully",
    data: seller,
  });
});
