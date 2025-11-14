/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import type { User } from '@/types/user';

type Props = {
  children: React.ReactNode;
  ssrUser: User | null;
};

export default function AuthProvider({ children, ssrUser }: Props) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);

  useEffect(() => {
    if (ssrUser) {
     
      setUser(ssrUser);
    } else {
  
      localStorage.removeItem("token");
      document.cookie = "token=; Max-Age=0; path=/; SameSite=Lax";
      

      clearIsAuthenticated();
    }

  }, []);

  return <>{children}</>;
}
