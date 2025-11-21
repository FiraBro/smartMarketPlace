import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import * as authService from "../services/authService.js";

// ---------------------
// Register
// ---------------------
export const registerUser = catchAsync(async (req, res, next) => {
  const { user, seller } = await authService.registerUserService(req.body);
  req.session.user = authService.createSessionUser(user);

  res.status(201).json({
    status: "success",
    message:
      user.role === "admin"
        ? "Admin registered successfully"
        : "User registered successfully",
    user: req.session.user,
    sellerId: seller?._id || null,
  });
});

// ---------------------
// Login
// ---------------------
export const loginUser = catchAsync(async (req, res, next) => {
  const { user } = await authService.loginUserService(req.body);
  req.session.user = authService.createSessionUser(user);

  res.json({
    status: "success",
    message:
      user.role === "admin"
        ? "Admin logged in successfully"
        : "Login successful",
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
// Update profile
// ---------------------
export const updateMe = catchAsync(async (req, res, next) => {
  if (!req.session.user)
    return res.status(401).json({ message: "Not authorized" });
  const updatedUser = await authService.updateMeService(
    req.session.user,
    req.body,
    req.file
  );
  req.session.user = authService.createSessionUser(updatedUser);

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
// Check auth
// ---------------------
export const checkAuth = catchAsync(async (req, res) => {
  if (req.session?.user)
    return res.json({ loggedIn: true, user: req.session.user });
  res.json({ loggedIn: false });
});

// ---------------------
// Get all sellers/buyers
// ---------------------
export const getAllSellers = catchAsync(async (req, res, next) => {
  const sellers = await authService.getAllSellersService();
  res
    .status(200)
    .json({ status: "success", results: sellers.length, data: { sellers } });
});

export const getAllBuyer = catchAsync(async (req, res, next) => {
  const users = await authService.getAllBuyersService();
  res
    .status(200)
    .json({ status: "success", results: users.length, data: { users } });
});
