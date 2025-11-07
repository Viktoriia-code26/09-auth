"use client";

import { create } from "zustand";
import { User } from "@/types/user";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
  logoutUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  
  setUser: (user) => set({ user, isAuthenticated: true }),

  
  clearIsAuthenticated: () => set({ user: null, isAuthenticated: false }),

  
  logoutUser: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
