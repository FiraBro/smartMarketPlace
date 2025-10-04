// controllers/newsletterController.js
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import Newsletter from "../models/NewsLetter.js";

export const subscribeNewsletter = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  // Check if already subscribed
  const existing = await Newsletter.findOne({ email });
  if (existing) {
    return res.status(200).json({ message: "You are already subscribed!" });
  }

  const subscriber = await Newsletter.create({ email });

  res.status(201).json({
    message: "Subscribed successfully!",
    subscriber,
  });
});
