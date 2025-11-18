"use client";

import { useState } from "react";
import { register, RegisterRequest } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import css from "./SignUpPage.module.css";
import { useAuthStore } from "@/lib/store/authStore";
import axios from "axios";

const SignUp = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);


  const handleSubmit = async (formData: FormData): Promise<void> => {
    try {
      const { email, password, username } = Object.fromEntries(formData) as RegisterRequest;

      const user = await register({ email, password, username });

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
      <h1 className={css.formTitle}>Sign Up</h1>

      <form className={css.form} action={handleSubmit}>
        <label className={css.formGroup}>
          Email
          <input
            type="email"
            name="email"
            className={css.input}
            required
          />
        </label>

        <label className={css.formGroup}>
          Username
          <input
            type="text"
            name="username"
            className={css.input}
            required
          />
        </label>

        <label className={css.formGroup}>
          Password
          <input
            type="password"
            name="password"
            className={css.input}
            required
          />
        </label>

        <button type="submit" className={css.submitButton}>
          Register
        </button>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
};

export default SignUp;
