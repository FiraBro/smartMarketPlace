import passport from "passport";
import { generateToken } from "../utils/generateToken.js";

export const githubLogin = passport.authenticate("github", {
  scope: ["user:email"],
});

export const githubCallback = [
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.FRONTEND_URL}/auth?token=${token}`);
  },
];
