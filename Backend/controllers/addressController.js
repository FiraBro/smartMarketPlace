import catchAsync from "../utils/catchAsync.js";
import * as addressService from "../services/addressService.js";

// ✅ Get all addresses for logged-in user
export const getAddresses = catchAsync(async (req, res, next) => {
  const addresses = await addressService.getAllAddresses(req.session.user._id);
  res.status(200).json(addresses);
});

// ✅ Create or Update address
export const createOrUpdateAddress = catchAsync(async (req, res, next) => {
  const address = await addressService.createOrUpdateAddressService(
    req.session.user._id,
    req.body
  );
  res.status(200).json(address);
});

// ✅ Update an address
export const updateAddress = catchAsync(async (req, res, next) => {
  const updated = await addressService.updateAddressService(
    req.params.id,
    req.session.user._id,
    req.body
  );
  res.status(200).json(updated);
});

// ✅ Delete an address
export const deleteAddress = catchAsync(async (req, res, next) => {
  await addressService.deleteAddressService(
    req.params.id,
    req.session.user._id
  );
  res.status(200).json({ message: "Address deleted successfully" });
});
