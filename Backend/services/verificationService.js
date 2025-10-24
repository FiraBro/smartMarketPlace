import { User } from "../models/User.js";
import AppError from "../utils/AppError.js";

export const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const saveVerificationCode = async (userId, field) => {
  const code = generateCode();

  const user = await User.findByIdAndUpdate(
    userId,
    { [`verificationCodes.${field}`]: code },
    { new: true }
  );

  if (!user) throw new AppError("User not found", 404);

  return code;
};

export const verifyUserCode = async (userId, field, code) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  // ✅ Compare as strings
  if (String(user.verificationCodes[field]) !== String(code)) {
    throw new AppError("Invalid verification code", 400);
  }

  // ✅ Update verified field
  user[field === "email" ? "emailVerified" : "phoneVerified"] = true;
  user.verificationCodes[field] = null;

  await user.save();
  return user;
};
