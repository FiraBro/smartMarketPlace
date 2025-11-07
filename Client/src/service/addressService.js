import axios from "axios";

// Base API instance for addresses (session-based)
const ADDRESS_API = axios.create({
  baseURL:
    import.meta.env.VITE_ADDRESS_URL ||
    "http://localhost:5000/api/v1/addresses",
  withCredentials: true, // ✅ send cookies for session auth
});

// Get all addresses for the logged-in user
export const getAddresses = async () => {
  const { data } = await ADDRESS_API.get("/");
  // Ensure each address has _id
  return data.map((addr) => ({
    _id: addr._id || addr.id,
    ...addr,
  }));
};

// Create a new address
export const createAddress = async (addressData) => {
  const { data } = await ADDRESS_API.post("/", addressData);
  return { _id: data._id || data.id, ...data };
};

// Update address
export const updateAddress = async (id, addressData) => {
  const { data } = await ADDRESS_API.put(`/${id}`, addressData);
  return { _id: data._id || data.id, ...data };
};

// Delete address
export const deleteAddress = async (id) => {
  const { data } = await ADDRESS_API.delete(`/${id}`);
  return data;
};
