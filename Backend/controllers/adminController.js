import catchAsync from "../utils/catchAsync.js";
import * as adminService from "../services/adminService.js";

// ✅ Approve seller
export const approveSeller = catchAsync(async (req, res, next) => {
  const seller = await adminService.approveSellerService(req.params.sellerId);
  res.status(200).json({
    status: "success",
    message: "Seller approved successfully",
    data: seller,
  });
});

// ✅ Suspend seller
export const suspendSeller = catchAsync(async (req, res, next) => {
  const seller = await adminService.suspendSellerService(req.params.sellerId);
  res.status(200).json({
    status: "success",
    message: "Seller suspended successfully",
    data: seller,
  });
});

// ✅ Verify buyer payment (hold funds in escrow)
export const verifyPayment = catchAsync(async (req, res, next) => {
  const order = await adminService.verifyPaymentService(req.params.id);
  res.status(200).json({
    status: "success",
    message: "Funds held in escrow",
    data: { order },
  });
});

// ✅ Release funds to seller
export const releaseFunds = catchAsync(async (req, res, next) => {
  const order = await adminService.releaseFundsService(req.params.id);
  res.status(200).json({
    status: "success",
    message: "Funds released to seller",
    data: { order },
  });
});
