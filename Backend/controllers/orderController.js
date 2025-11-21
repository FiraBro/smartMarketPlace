import catchAsync from "../utils/catchAsync.js";
import * as orderService from "../services/orderService.js";

// ----------------------------
// Controller
// ----------------------------
export const createOrder = catchAsync(async (req, res) => {
  const sessionUser = orderService.getSessionUser(req);
  const { products, address, deliveryMethod } = req.body;

  const order = await orderService.createOrderService(
    sessionUser,
    products,
    address,
    deliveryMethod
  );

  res.status(201).json(order);
});

export const uploadPaymentProof = catchAsync(async (req, res) => {
  const sessionUser = orderService.getSessionUser(req);
  const { orderId, productId } = req.params;
  const { transactionId } = req.body;

  const product = await orderService.uploadPaymentProofService(
    sessionUser,
    orderId,
    productId,
    req.file,
    transactionId
  );

  res.json({ message: "Payment proof uploaded", product });
});
