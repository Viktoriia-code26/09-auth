// components/AuthProvider/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const session = await checkSession();

      if (session) {
        const user = await getMe();
        if (user) setUser(user);
        else clearAuth();
      } else {
        clearAuth();
      }

      setLoading(false);
    };

    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
}
