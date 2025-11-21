import catchAsync from "../utils/catchAsync.js";
import * as supportService from "../services/supportService.js";

/**
 * Controller to handle sending a support message
 */
export const sendSupportMessage = catchAsync(async (req, res) => {
  const newMessage = await supportService.createSupportMessage(req.body);

  res.status(201).json({
    success: true,
    message: "Your message has been sent successfully!",
    data: newMessage,
  });
});
