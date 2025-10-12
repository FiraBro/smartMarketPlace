import passport from "passport";
import jwt from "jsonwebtoken";

export const githubLogin = passport.authenticate("github", {
  scope: ["user:email"],
});

export const githubCallback = [
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.redirect(`${process.env.FRONTEND_URL}/auth?token=${token}`);
  },
];

export const facebookLogin = passport.authenticate("facebook", {
  scope: ["email"],
});

export const facebookCallback = [
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.redirect(`${process.env.FRONTEND_URL}/auth?token=${token}`);
  },
];
