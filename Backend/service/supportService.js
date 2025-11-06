import supportMessage from "../models/SupportMessage.js";
import AppError from "../utils/AppError.js";

export const createSupportMessage = async (data) => {
  const { name, email, subject, message } = data;

  if (!name || !email || !subject || !message) {
    throw new AppError("All fields are required", 400);
  }

  const newMessage = await supportMessage.create({
    name,
    email,
    subject,
    message,
  });

  return newMessage;
};
