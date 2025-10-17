export const protectAdmin = (req, res, next) => {
  if (req.session.admin) return next();
  res.status(401).json({ status: "fail", message: "Admin not authorized" });
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
