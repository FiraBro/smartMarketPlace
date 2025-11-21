import passport from "passport";
import { createOAuthSession } from "../services/oauthService.js";

// -------------------
// GitHub Login
// -------------------
export const githubLogin = passport.authenticate("github", {
  scope: ["user:email"],
});

export const githubCallback = [
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.user = createOAuthSession(req.user);
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
    req.session.user = createOAuthSession(req.user);
    res.redirect(process.env.FRONTEND_URL || "http://localhost:5173");
  },
];
