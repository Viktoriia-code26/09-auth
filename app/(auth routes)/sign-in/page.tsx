"use client";

import { useState } from "react";
import { login, LoginRequest } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import axios from "axios";
import css from "./SignInPage.module.css";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const setUser = useAuthStore((s) => s.setUser);

  const handleSubmit = async (formData: FormData) => {
    setError("");
    try {
      const values = Object.fromEntries(formData) as LoginRequest;
      const user = await login(values);
      setUser(user);
      router.push("/profile");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign In</h1>

      <form className={css.form} action={handleSubmit}>
        <label className={css.formGroup}>
          Email
          <input type="email" name="email" required className={css.input} />
        </label>

        <label className={css.formGroup}>
          Password
          <input type="password" name="password" required className={css.input} />
        </label>

        <button className={css.submitButton}>Log in</button>
        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
