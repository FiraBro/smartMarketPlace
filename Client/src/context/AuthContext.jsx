import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  updateProfile,
  checkAuthStatus,
} from "../service/AuthService"; // adjust path if needed

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // 🔹 Check if user is logged in
  // -----------------------------
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const data = await checkAuthStatus();
        if (data.loggedIn) setUser(data.user);
        else setUser(null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
  }, []);

  // -----------------------------
  // 🔹 Auth Actions
  // -----------------------------
  const login = async (credentials) => {
    const data = await loginUser(credentials);
    setUser(data.user);
    return data.user;
  };

  const register = async (info) => {
    const data = await registerUser(info);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const updateUser = async (updates) => {
    const updated = await updateProfile(updates);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
