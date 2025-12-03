"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { getMe } from "@/lib/api/clientApi";

export default function AuthInitializer() {
  const { user, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    async function loadUser() {
      try {
        const me = await getMe();  
        setUser(me);
      } catch {
        setUser(null);
        setLoading(false);
      }
    }

    if (!user) loadUser();
    else setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
