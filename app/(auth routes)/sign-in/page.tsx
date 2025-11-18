"use client";

import { useState } from "react";
import { login, LoginRequest } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import css from "./SignInPage.module.css";
import { useAuthStore } from "@/lib/store/authStore";
import axios from "axios";

const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (formData: FormData): Promise<void> => {
    try {
      const { email, password } = Object.fromEntries(formData) as LoginRequest;
      const user = await login(email, password);

      setUser(user);

      router.push("/profile");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? err.message);
      } else {
        setError("Unexpected error");
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} action={handleSubmit}>
        <h1 className={css.formTitle}>Sign In</h1>

        <label className={css.formGroup}>
          Email
          <input type="email" name="email" className={css.input} required />
        </label>

        <label className={css.formGroup}>
          Password
          <input type="password" name="password" className={css.input} required />
        </label>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
};

export default SignIn;
