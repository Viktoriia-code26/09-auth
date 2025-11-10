"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { logout } from "@/lib/api/clientApi";
import css from "./AuthNavigation.module.css";

const AuthNavigation = () => {
  const router = useRouter();

  const { isAuthenticated, user, clearUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      clearUser(); 
      router.push("/sign-in");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (isAuthenticated && user) {
    return (
      <ul className={css.navigationList}>
        <li>
          <Link href="/profile" className={css.navigationLink}>
            Profile
          </Link>
        </li>
        <li>
          <span className={css.userEmail}>{user.email}</span>
        </li>
        <li>
          <button onClick={handleLogout} className={css.logoutButton}>
            Logout
          </button>
        </li>
      </ul>
    );
  }

  return (
    <ul className={css.navigationList}>
      <li>
        <Link href="/sign-in" className={css.navigationLink}>
          Login
        </Link>
      </li>
      <li>
        <Link href="/sign-up" className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </ul>
  );
};

export default AuthNavigation;
