import axios from "axios";

/**
 * Initialize Chapa Payment
 * @param {Object} payload - { amount, first_name, last_name, email, phone_number, tx_ref }
 * @returns {Promise} - returns Chapa checkout URL and data
 */
export const initializeChapaPayment = async (payload) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/payments/chapa/initiate",
      payload
    );
    return response.data?.data; // contains checkout_url, tx_ref, etc.
  } catch (error) {
    console.error(
      "❌ Chapa Init Error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to initialize Chapa payment");
  }
};

/**
 * Verify Chapa Payment (optional manual check)
 * @param {string} transactionId
 * @returns {Promise}
 */
export const verifyChapaPayment = async (transactionId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/payments/chapa/verify/${transactionId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Chapa Verify Error:",
      error.response?.data || error.message
    );
    throw new Error("Payment verification failed");
  }
};

/**
 * Initialize Telebirr Payment
 * @param {Object} payload - { amount, first_name, last_name, phone_number, tx_ref }
 * @returns {Promise} - returns Telebirr payment URL
 */
export const initializeTelebirrPayment = async (payload) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/payments/telebirr/initiate",
      payload
    );
    return response.data?.paymentUrl;
  } catch (error) {
    console.error(
      "❌ Telebirr Init Error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to initialize Telebirr payment");
  }
};
