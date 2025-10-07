import crypto from "crypto";

/**
 * Generate Telebirr Signature
 * (Update according to Telebirr spec — this uses HMAC-SHA256 for simplicity)
 */
export const generateTelebirrSignature = (payload) => {
  const secret = process.env.TELEBIRR_APP_KEY; // merchant secret
  const sorted = Object.keys(payload)
    .sort()
    .map((k) => `${k}=${payload[k]}`)
    .join("&");
  return crypto.createHmac("sha256", secret).update(sorted).digest("hex");
};

/**
 * Verify Telebirr Webhook Signature
 */
export const verifyTelebirrSignature = (payload, signature) => {
  const localSig = generateTelebirrSignature(payload);
  return localSig === signature;
};
