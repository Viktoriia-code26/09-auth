"use client";

import { useState } from "react";
import { extractApiError, login, LoginRequest } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import css from "./SignInPage.module.css";
import { useAuthStore } from "@/lib/store/authStore";

const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    try {
      const { email, password } = Object.fromEntries(formData) as LoginRequest;
      const user = await login(email, password);

      setUser(user);
      router.push("/profile");

    } catch (err) {
      setError(extractApiError(err));
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
};

export default SignIn;
