import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, LoginCredentials, AuthContextType } from "../types";
import { authService } from "../services/authService";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token");
      const userData = localStorage.getItem("user_data");

      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Failed to parse user data:", error);
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_data");
        }
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const userData = await authService.login(credentials);
      const token = "fake-jwt-token-" + Date.now();

      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_data", JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
