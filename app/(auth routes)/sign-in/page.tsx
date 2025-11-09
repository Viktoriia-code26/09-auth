"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { login, LoginRequest } from "@/lib/api/clientApi";
import css from "./SignInPage.module.css";

const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

 const handleSubmit = async (formData: FormData) => {
  setError("");
  try {
    const formValues = Object.fromEntries(formData) as LoginRequest;
    const user = await login(formValues);
    setUser(user);
    router.push("/profile");
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Ошибка входа");
    }
  }
};

  return (
    <form action={handleSubmit} className={css.form}>
      <h1 className={css.formTitle}>Sign in</h1>
      <label className={css.formGroup}>
        Email
        <input type="email" name="email" required className={css.input} />
      </label>
      <label className={css.formGroup}>
        Password
        <input type="password" name="password" required className={css.input} />
      </label>
      <button type="submit" className={css.submitButton}>
        Log in
      </button>
      {error && <p className={css.error}>{error}</p>}
    </form>
  );
};

export default SignIn;
