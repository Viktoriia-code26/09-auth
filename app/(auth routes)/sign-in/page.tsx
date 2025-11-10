"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, LoginRequest } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignInPage.module.css";

export default function SignInPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const user = await login({ email, password } as LoginRequest);

      if (user) {
        setUser(user); 
        window.location.replace("/profile"); 
      } else {
        setError("Неверный email или пароль");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ошибка входа");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <h1 className={css.formTitle}>Sign In</h1>

      <label className={css.formGroup}>
        Email
        <input type="email" name="email" required className={css.input} />
      </label>

      <label className={css.formGroup}>
        Password
        <input
          type="password"
          name="password"
          required
          minLength={6}
          className={css.input}
        />
      </label>

      <button type="submit" disabled={isLoading} className={css.submitButton}>
        {isLoading ? "Logging in..." : "Log in"}
      </button>

      {error && <p className={css.error}>{error}</p>}
    </form>
  );
}
