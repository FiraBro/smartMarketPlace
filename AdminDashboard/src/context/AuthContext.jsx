// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  logoutUser,
  getCurrentUser,
  getAllSellers,
  getAllBuyer,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const user = await getCurrentUser();
        setAdmin(user);
      } catch {
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    setAdmin(data.data.admin);
    return data;
  };

  const logout = async () => {
    await logoutUser();
    setAdmin(null);
  };

  const fetchSellers = async () => {
    try {
      const data = await getAllSellers();
      setSellers(data.data.sellers);
      return data.data.sellers;
    } catch (err) {
      console.error("Failed to fetch sellers:", err);
      return [];
    }
  };

  const fetchBuyers = async () => {
    try {
      const data = await getAllBuyer();
      setBuyers(data.data.users);
      return data.data.buyers;
    } catch (err) {
      console.error("Failed to fetch buyers:", err);
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        login,
        logout,
        loading,
        sellers,
        buyers,
        fetchSellers,
        fetchBuyers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
