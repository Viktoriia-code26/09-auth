"use client";

import { useEffect, useState } from "react";
import { getMe, checkSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  children: React.ReactNode;
};


const AuthProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser, clearIsAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const isAuthenticated = await checkSession();

        if (isAuthenticated) {
          const user = await getMe();
          if (user) setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } catch (error) {
        console.error("AuthProvider error:", error);
        clearIsAuthenticated();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [setUser, clearIsAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
