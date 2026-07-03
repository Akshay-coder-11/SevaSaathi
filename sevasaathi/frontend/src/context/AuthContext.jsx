import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

// Provides current user, login/register/logout actions, and loading state
// to the entire app.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, check if a token exists and fetch the current user.
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("sevasaathi_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch (err) {
        localStorage.removeItem("sevasaathi_token");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("sevasaathi_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("sevasaathi_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const updateUser = async (payload) => {
    const { data } = await api.put("/auth/me", payload);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("sevasaathi_token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access: const { user, login } = useAuth();
export const useAuth = () => useContext(AuthContext);
