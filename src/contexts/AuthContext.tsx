import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  userRole: string | null;
  setUserRole: (role: string | null) => void;
  login: (user: User, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const login = (userData: User, role: string) => {
    setUser(userData);
    setUserRole(role);
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, userRole, setUserRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
