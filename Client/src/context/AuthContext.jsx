import { createContext, useContext, useState, useEffect } from "react";
import {
  login,
  register,
  logout,
  updateProfile,
  checkAuthStatus,
  getCurrentUser,
  getAllBuyers,
  getAllSellers,
  getListingDetails,
} from "../service/AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [listings, setListings] = useState([]); // ⬅ FIX plural

  // -----------------------------
  // Auth Check on App Load
  // -----------------------------
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const data = await checkAuthStatus();
        setUser(data.loggedIn ? data.user : null);
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
  }, []);

  // -----------------------------
  // Fetch Sellers
  // -----------------------------
  const fetchSellers = async () => {
    try {
      const res = await getAllSellers();
      console.log(res);
      setSellers(res.data.data.users);
    } catch (err) {
      console.error("Failed to fetch sellers:", err);
    }
  };

  // -----------------------------
  // Fetch Buyers
  // -----------------------------
  const fetchBuyers = async () => {
    try {
      const res = await getAllBuyers();
      setBuyers(res.data.data.users); // ✔ actual buyer array
    } catch (err) {
      console.error("Failed to fetch buyers:", err);
    }
  };

  // -----------------------------
  // Fetch Listings
  // -----------------------------
  const fetchListings = async () => {
    try {
      const res = await getListingDetails(); // ⬅ FIX: call actual service
      setListings(res.data || res);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    }
  };

  // -----------------------------
  // Auth Actions
  // -----------------------------
  const loginUser = async (credentials) => {
    const data = await login(credentials);
    setUser(data.user);
    return data.user;
  };

  const registerUserFunc = async (info) => {
    const data = await register(info);
    setUser(data.user);
    return data.user;
  };

  const logoutUserFunc = async () => {
    await logout();
    setUser(null);
  };

  const updateUser = async (updates) => {
    const updated = await updateProfile(updates);
    setUser(updated);
    return updated;
  };

  const fetchCurrentUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (err) {
      setUser(null);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,

        // Auth actions
        login: loginUser,
        register: registerUserFunc,
        logout: logoutUserFunc,
        updateUser,
        fetchCurrentUser,

        // NEW admin data
        sellers,
        buyers,
        listings, // ⬅ FIX: export it
        fetchSellers,
        fetchBuyers,
        fetchListings, // ⬅ FIX: export function
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
