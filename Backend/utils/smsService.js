// utils/smsService.js
import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const normalizePhone = (phone) => {
  // Example for Ethiopian numbers
  if (phone.startsWith("0")) return `+251${phone.slice(1)}`;
  return phone;
};

export const sendSMSCode = async (phone, code) => {
  try {
    const to = normalizePhone(phone);
    await client.messages.create({
      body: `Your verification code is ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log(`✅ SMS sent to ${to}`);
  } catch (err) {
    console.error("❌ Failed to send SMS:", err.message);
    throw new Error("Failed to send SMS");
  }
};
