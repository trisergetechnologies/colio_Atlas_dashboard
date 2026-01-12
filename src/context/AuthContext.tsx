"use client";

import { getToken, removeToken, setToken } from "@/utils/tokenHelper";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

/* ================= TYPES ================= */

interface AdminProfile {
  adminId: string;
  name: string;
  email: string;
  role: "admin";
  avatar?: string | null;
}

interface AuthContextType {
  adminProfile: AdminProfile | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (token: string, profile: AdminProfile) => void;
  logout: () => void;
}

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  /* ================= INIT AUTH ================= */
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();

      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      try {
        // Optional: verify token / fetch admin profile
        const url = `${process.env.NEXT_PUBLIC_API_URL}/user/profile`
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAdminProfile(res.data.data);
      } catch (error) {
        console.error("Auth init failed", error);
        removeToken();
        setAdminProfile(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  /* ================= LOGIN ================= */
  const login = async (token: string, profile: AdminProfile) => {
    await setToken(token);
    setAdminProfile(profile);
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    removeToken();
    setAdminProfile(null);

    // optional hard redirect
    window.location.href = "/auth";
  };

  /* ================= CONTEXT VALUE ================= */
  const value: AuthContextType = {
    adminProfile,
    isAuthenticated: !!adminProfile,
    isAuthLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ================= HOOK ================= */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
