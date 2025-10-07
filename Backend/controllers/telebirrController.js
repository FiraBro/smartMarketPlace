import axios from "axios";
import crypto from "crypto";
import Order from "../models/orderModel.js";
import { generateTelebirrSignature } from "../config/telebirrConfig.js";

// 🟢 Initialize Telebirr Payment
export const initializeTelebirrPayment = async (req, res) => {
  try {
    const { amount, first_name, last_name, phone_number, tx_ref } = req.body;

    // 1️⃣ Create order
    await Order.create({
      tx_ref,
      amount,
      first_name,
      last_name,
      phone_number,
      status: "Pending",
    });

    // 2️⃣ Build payload
    const payload = {
      appId: process.env.TELEBIRR_APP_KEY,
      nonce: crypto.randomBytes(8).toString("hex"),
      notifyUrl: process.env.TELEBIRR_NOTIFY_URL,
      outTradeNo: tx_ref,
      receiveName: `${first_name} ${last_name}`,
      returnUrl: process.env.TELEBIRR_RETURN_URL,
      shortCode: process.env.TELEBIRR_SHORT_CODE,
      subject: "Online Purchase",
      timeoutExpress: "30",
      totalAmount: amount,
    };

    // 3️⃣ Sign request
    const signature = generateTelebirrSignature(payload);

    // 4️⃣ Send to Telebirr
    const response = await axios.post(
      "https://app.ethiotelecom.et:4443/service-openup/toTradeWebPay",
      { ...payload, signature }
    );

    // 5️⃣ Return URL
    res.json({ success: true, paymentUrl: response.data?.data?.toPayUrl });
  } catch (error) {
    console.error(
      "❌ Telebirr Init Error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to initialize Telebirr payment" });
  }
};

// 🟢 Webhook (Auto update)
export const telebirrWebhook = async (req, res) => {
  const { outTradeNo, tradeStatus } = req.body;

  try {
    if (tradeStatus === "SUCCESS") {
      await Order.findOneAndUpdate(
        { tx_ref: outTradeNo },
        { status: "Paid" },
        { new: true }
      );
    }
    res.status(200).json({ message: "Webhook received" });
  } catch (error) {
    console.error("❌ Telebirr Webhook Error:", error.message);
    res.status(500).json({ error: "Webhook failed" });
  }
};
