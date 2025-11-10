"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { getMe } from "@/lib/api/clientApi";
import type { User } from "@/types/user";
import css from "../Loader/Loader.module.css";

export default function AuthProvider({
  children,
  ssrUser,
}: {
  children: React.ReactNode;
  ssrUser?: User | null;
}) {
  const { setUser, clearUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (ssrUser) {
          setUser(ssrUser);
          setIsLoading(false);
          return;
        }
        const token = localStorage.getItem("token");
        if (!token) {
          clearUser();
          setIsLoading(false);
          return;
        }
        const user = await getMe();
        if (user) {
          setUser(user);
        } else {
          clearUser();
        }
      } catch (err) {
        console.error("AuthProvider init error:", err);
        clearUser();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [ssrUser, setUser, clearUser]);

  if (isLoading) {
    return (
      <div className={css.text}>
        <p>Loading authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}
