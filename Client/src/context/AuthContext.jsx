import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
} from "../service/AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on first render (if token exists)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setUser(null); // no valid token
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // login
  const login = async (credentials) => {
    const data = await loginUser(credentials);
    setUser(data.user);
  };

  // register
  const register = async (info) => {
    const data = await registerUser(info);
    setUser(data.user);
  };

  // logout
  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
