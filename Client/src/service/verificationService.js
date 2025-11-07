import axios from "axios";

// ✅ Axios instance for verification (session-based)
const VERIFY_API = axios.create({
  baseURL:
    import.meta.env.VITE_VARIFY_API_URL ||
    "http://localhost:5000/api/v1/verify",
  withCredentials: true, // ✅ send session cookies automatically
});

// ✅ Send verification code for a specific field
export const sendVerificationCode = (field) =>
  VERIFY_API.post(`/${field}/send`);

// ✅ Verify code for a specific field
export const verifyCode = (field, code) =>
  VERIFY_API.post(`/${field}/verify`, { code });
