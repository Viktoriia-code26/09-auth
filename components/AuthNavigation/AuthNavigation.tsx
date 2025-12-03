"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { logout } from "@/lib/api/clientApi";
import css from "./AuthNavigation.module.css";

export default function AuthNavigation() {
  const { isAuthenticated, user, loading, clearAuth } = useAuthStore();
  const router = useRouter();

  if (loading) return null;

  const handleLogout = async () => {
    await logout();
    clearAuth();
    router.push("/sign-in");
  };

  return (
    <>
      {isAuthenticated && (
        <li className={css.navigationItem}>
          <Link href="/profile" className={css.navigationLink}>
            Profile
          </Link>
        </li>
      )}

      {!isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link href="/sign-in" className={css.navigationLink}>
              Login
            </Link>
          </li>
          <li className={css.navigationItem}>
            <Link href="/sign-up" className={css.navigationLink}>
              Sign up
            </Link>
          </li>
        </>
      ) : (
        <li className={css.navigationItem}>
          <span className={css.userEmail}>{user?.email}</span>
          <button className={css.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </li>
      )}
    </>
  );
}
