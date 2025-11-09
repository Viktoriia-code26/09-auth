"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import type { User } from "@/types/user";
import css from "../Loader/Loader.module.css"

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
    const init = async () => {
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
      if (user) setUser(user);
      else clearUser();

      setIsLoading(false);
    };

    init();
  }, [setUser, clearUser, ssrUser]);

  if (isLoading) {
    return (
      <div className={css.text}>
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
