import AppError from "../utils/AppError.js";
import Seller from "../models/Seller.js";
// ---------------------
// General protection
// ---------------------
export const protect = (req, res, next) => {
  if (req.session.user) return next();
  res.status(401).json({ status: "fail", message: "Not authorized" });
};

// ---------------------
// Seller-only routes
// ---------------------
export const protectSeller = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "seller") {
    return res
      .status(403)
      .json({ status: "fail", message: "Seller only route" });
  }
  next();
};

// ---------------------
// Restrict to specific roles
// ---------------------
export const restrictTo = (...roles) => {
  console.log("Restricting to roles:", roles);
  return (req, res, next) => {
    if (!req.session.user || !roles.includes(req.session.user.role)) {
      return res
        .status(403)
        .json({ status: "fail", message: "Insufficient permission" });
    }
    next();
  };
};

// middlewares/checkSellerStatus.js

export const checkSellerStatus = async (req, res, next) => {
  const seller = await Seller.findOne({ user: req.user._id });

  if (!seller) return next(new AppError("Seller account not found", 404));

  if (seller.status === "suspended") {
    return next(
      new AppError("Your account is suspended. Contact support.", 403)
    );
  }

  next();
};
