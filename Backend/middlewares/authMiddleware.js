import AppError from "../utils/AppError.js";
import Seller from "../models/Seller.js";

// ---------------------
// General protection (any logged-in user)
// ---------------------
export const protect = (req, res, next) => {
  if (!req.session?.user) {
    return res
      .status(401)
      .json({ status: "fail", message: "Not authorized — please log in" });
  }

  next();
};

// ---------------------
// Role-based protection
// ---------------------
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.session?.user || !roles.includes(req.session.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "Access denied — insufficient permissions",
      });
    }

    next();
  };
};

// ---------------------
// Seller-only protection (optional specialized middleware)
// ---------------------
export const protectSeller = (req, res, next) => {
  if (!req.session?.user || req.session.user.role !== "seller") {
    return res
      .status(403)
      .json({ status: "fail", message: "Seller-only route" });
  }

  next();
};

// ---------------------
// Check seller account status
// ---------------------
export const checkSellerStatus = async (req, res, next) => {
  const seller = await Seller.findOne({ user: req.session.user.id });

  if (!seller) return next(new AppError("Seller account not found", 404));

  if (seller.status === "suspended") {
    return next(
      new AppError("Your seller account is suspended. Contact support.", 403)
    );
  }

  next();
};
