import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { User } from "../models/User.js";
import e from "express";

export const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Not authorized, token missing", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select("-password");

  if (!req.user) {
    return next(new AppError("User not found", 404));
  }

  next();
});
export const protectSeller = (req, res, next) => {
  if (!req.user || req.user.role !== "seller") {
    return next(new AppError("Access denied: Seller only route", 403));
  }
  next();
};
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("Access denied: You do not have permission", 403)
      );
    }
    next();
  };
};
