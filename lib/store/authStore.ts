// lib/store/authStore.ts
import { create } from "zustand";
import type { User } from "@/types/user";

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  setLoading: (value: boolean) => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  setUser: (user) => set({ user, isAuthenticated: true, loading: false }),
  clearAuth: () => set({ user: null, isAuthenticated: false, loading: false }),
  setLoading: (value) => set({ loading: value }),
}));