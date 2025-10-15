import passport from "passport";

// -------------------
// GitHub Login
// -------------------
export const githubLogin = passport.authenticate("github", {
  scope: ["user:email"],
});

export const githubCallback = [
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    // ✅ Store session consistently
    req.session.user = {
      _id: req.user._id, // always _id
      name: req.user.name,
      email: req.user.email,
      role: req.user.role || "buyer", // default role
    };
    res.redirect(process.env.FRONTEND_URL || "http://localhost:5173");
  },
];

// -------------------
// Google Login
// -------------------
export const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleCallback = [
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // ✅ Store session consistently
    req.session.user = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role || "buyer",
    };
    res.redirect(process.env.FRONTEND_URL || "http://localhost:5173");
  },
];
