import SupportMessage from "../models/SupportMessage.js";
import AppError from "../utils/AppError.js";

/**
 * Create a new support message
 * @param {Object} data - The support message data
 * @returns {Promise<SupportMessage>}
 */
export const createSupportMessage = async (data) => {
  if (!data || !data.userId || !data.message) {
    throw new AppError("User ID and message are required", 400);
  }

  const newMessage = await SupportMessage.create(data);
  return newMessage;
};
