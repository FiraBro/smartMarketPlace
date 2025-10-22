import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  updateProfile,
  checkAuthStatus,
  getCurrentUser,
} from "../service/AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // Check if user is logged in initially
  // -----------------------------
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const data = await checkAuthStatus();
        if (data.loggedIn) setUser(data.user);
        else setUser(null);
      } catch (err) {
        console.error("Auth check failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
  }, []);

  // -----------------------------
  // Auth Actions
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
        login,
        register,
        logout,
        updateUser,
        fetchCurrentUser,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children} {/* always render children */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
