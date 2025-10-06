import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import {
  saveVerificationCode,
  verifyUserCode,
} from "../service/verificationService.js";
import { sendEmailCode } from "../service/emailService.js";
import { sendSMSCode } from "../utils/smsService.js";

// ✅ Send code to email or phone
export const sendCode = catchAsync(async (req, res, next) => {
  const { field } = req.params;
  const userId = req.user._id;

  if (!["email", "phone"].includes(field)) {
    return next(new AppError("Invalid verification field", 400));
  }

  const code = await saveVerificationCode(userId, field);

  if (field === "email") {
    await sendEmailCode(req.user.email, code);
  } else {
    await sendSMSCode(req.user.phone, code);
  }

  console.log(`✅ Verification code for ${field}: ${code}`);

  res.status(200).json({
    status: "success",
    message: `${field} verification code sent successfully`,
  });
});

export const verifyCode = async (req, res) => {
  const { field, code } = req.body;
  const userId = req.user.id; // from JWT middleware

  const isValid = await verifyUserCode(userId, field, code);
  if (!isValid)
    return res.status(400).json({ message: "Invalid or expired code" });

  const updateField =
    field === "email" ? { isEmailVerified: true } : { isPhoneVerified: true };

  const updatedUser = await User.findByIdAndUpdate(userId, updateField, {
    new: true,
  }).select("-password");

  return res.status(200).json({
    status: "success",
    message: `${field} verified successfully`,
    user: updatedUser,
  });
};
