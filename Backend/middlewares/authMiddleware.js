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
