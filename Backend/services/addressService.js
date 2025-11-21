import Address from "../models/Address.js";
import AppError from "../utils/AppError.js";

export const getAllAddresses = async (userId) => {
  return await Address.find({ userId });
};

export const createOrUpdateAddressService = async (userId, addressData) => {
  return await Address.findOneAndUpdate(
    { userId },
    { ...addressData, userId },
    { new: true, upsert: true }
  );
};

export const updateAddressService = async (id, userId, addressData) => {
  const updated = await Address.findOneAndUpdate(
    { _id: id, userId },
    addressData,
    { new: true }
  );
  if (!updated) throw new AppError("Address not found", 404);
  return updated;
};

export const deleteAddressService = async (id, userId) => {
  const deleted = await Address.findOneAndDelete({ _id: id, userId });
  if (!deleted) throw new AppError("Address not found", 404);
  return deleted;
};
