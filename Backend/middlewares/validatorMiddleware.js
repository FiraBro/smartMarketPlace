import Joi from "joi";

export const supportMessageSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Name must be at least 3 characters",
  }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),

  subject: Joi.string().min(3).max(150).required().messages({
    "string.empty": "Subject is required",
    "string.min": "Subject must be at least 3 characters",
  }),

  message: Joi.string().min(10).max(2000).required().messages({
    "string.empty": "Message content is required",
    "string.min": "Message must be at least 10 characters",
  }),
});
