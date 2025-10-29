export const protectAdmin = (req, res, next) => {
  if (!req.session.admin || req.session.admin.role !== "admin") {
    return res
      .status(403)
      .json({ status: "fail", message: "Admin only route" });
  }
  next();
};
export const restrictToAdmin = (...roles) => {
  return (req, res, next) => {
    if (!req.session.admin || !roles.includes(req.session.admin.role)) {
      return res
        .status(403)
        .json({ status: "fail", message: "Insufficient permission" });
    }
    next();
  };
};
