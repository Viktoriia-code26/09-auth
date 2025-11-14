"use client";

import { useState } from "react";
import { register, RegisterRequest } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import axios from "axios";
import css from "./SignUpPage.module.css";

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setError("");

    try {
      const values = Object.fromEntries(formData) as RegisterRequest;
      const user = await register(values);

      setUser(user);
      router.push("/profile");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setError("Email already exists");
      } else {
        setError("Registration failed");
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign Up</h1>

      <form className={css.form} action={handleSubmit}>
        <label className={css.formGroup}>
          Email
          <input type="email" name="email" required className={css.input} />
        </label>

        <label className={css.formGroup}>
          Password
          <input type="password" name="password" required className={css.input} />
        </label>

        <button className={css.submitButton}>Register</button>
        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
