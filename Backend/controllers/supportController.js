import { createSupportMessage } from "../services/supportService.js";
import catchAsync from "../utils/catchAsync.js";

export const sendSupportMessage = catchAsync(async (req, res) => {
  const newMessage = await createSupportMessage(req.body);

  return res.status(201).json({
    success: true,
    message: "Your message has been sent successfully!",
    data: newMessage,
  });
});
