"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignUpPage.module.css";

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setError("");
    setIsLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    try {
      const user = await register({ email, password });
      setUser(user);
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <h1 className={css.formTitle}>Sign Up</h1>

      <label className={css.formGroup}>
        Email
        <input name="email" type="email" required className={css.input} />
      </label>

      <label className={css.formGroup}>
        Password
        <input name="password" type="password" required minLength={6} className={css.input} />
      </label>

      <button type="submit" disabled={isLoading} className={css.submitButton}>
        {isLoading ? "Registering..." : "Register"}
      </button>

      {error && <p className={css.error}>{error}</p>}
    </form>
  );
}
