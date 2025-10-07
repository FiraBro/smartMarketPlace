import chapa from "../config/chapaConfig.js";
import Order from "../models/orderModel.js";

// 🟢 Initialize Payment
export const initializePayment = async (req, res) => {
  try {
    const { amount, first_name, last_name, email, phone_number, tx_ref } =
      req.body;

    // 1️⃣ Create order
    await Order.create({
      tx_ref,
      amount,
      first_name,
      last_name,
      email,
      phone_number,
      status: "Pending",
    });

    // 2️⃣ Request to Chapa API
    const chapaResponse = await chapa.post("/transaction/initialize", {
      amount,
      currency: "ETB",
      first_name,
      last_name,
      email,
      phone_number,
      tx_ref,
      return_url: process.env.CHAPA_RETURN_URL,
      callback_url: process.env.CHAPA_WEBHOOK_URL,
    });

    // 3️⃣ Return checkout URL to frontend
    res.json({
      success: true,
      data: chapaResponse.data.data,
    });
  } catch (error) {
    console.error(
      "❌ Chapa Init Error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to initialize Chapa payment",
      details: error.response?.data,
    });
  }
};

// 🟢 Verify Payment (Manual)
export const verifyPayment = async (req, res) => {
  try {
    const { transaction_id } = req.params;
    const response = await chapa.get(`/transaction/verify/${transaction_id}`);
    const payment = response.data.data;

    if (payment.status === "success") {
      await Order.findOneAndUpdate(
        { tx_ref: payment.tx_ref },
        { status: "Paid" },
        { new: true }
      );
    }

    res.json(response.data);
  } catch (error) {
    console.error("❌ Verify Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

// 🟢 Webhook (Auto update)
export const chapaWebhook = async (req, res) => {
  try {
    const payload = req.body;
    console.log("📩 Chapa Webhook Received:", payload);

    if (payload.data?.status === "success") {
      const txRef = payload.data.tx_ref;
      await Order.findOneAndUpdate(
        { tx_ref: txRef },
        { status: "Paid" },
        { new: true }
      );
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    res.status(500).json({ error: "Webhook failed" });
  }
};
