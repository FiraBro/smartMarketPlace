import AppError from "../utils/AppError.js";

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const messages = error.details.map((err) => err.message);
    return next(new AppError(messages.join(", "), 400));
  }

  next();
};
