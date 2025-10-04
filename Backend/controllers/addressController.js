// controllers/addressController.js
import Address from "../models/Address.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

// ✅ Get all addresses for logged-in user
export const getAddresses = catchAsync(async (req, res, next) => {
  const addresses = await Address.find({ userId: req.user._id });
  res.status(200).json(addresses);
});

// ✅ Create a new address
// ✅ Create or Update the user's single delivery address
export const createOrUpdateAddress = catchAsync(async (req, res, next) => {
  const address = await Address.findOneAndUpdate(
    { userId: req.user._id }, // match by logged-in user
    { ...req.body, userId: req.user._id },
    { new: true, upsert: true } // update if exists, create if not
  );

  res.status(200).json(address);
});

// ✅ Update an address
export const updateAddress = catchAsync(async (req, res, next) => {
  const updated = await Address.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true }
  );

  if (!updated) {
    return next(new AppError("Address not found", 404));
  }

  res.status(200).json(updated);
});

// ✅ Delete an address
export const deleteAddress = catchAsync(async (req, res, next) => {
  const deleted = await Address.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!deleted) {
    return next(new AppError("Address not found", 404));
  }

  res.status(200).json({ message: "Address deleted successfully" });
});
