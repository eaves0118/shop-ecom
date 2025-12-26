"use client";

import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User } from "../../types/user";
import { signin, signup } from "@/lib/api/AuthService";
import { useRouter } from "next/navigation";

interface AuthContextProps {
  children: ReactNode;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: AuthContextProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!user;

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      const res = await signin(username, password);
      setUser(res.data.user);
      if (res.data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, password: string) => {
    try {
      setLoading(true);
      await signup(username, password);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  // Nếu dùng hook này bên ngoài Provider, nó sẽ báo lỗi rõ ràng
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }

  return context;
};
