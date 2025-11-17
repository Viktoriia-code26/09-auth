"use client";

import { useState } from "react";
import { register, RegisterRequest } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import css from "./SignUpPage.module.css";
import { ApiError } from '@/app/api/api'
import { useAuthStore } from "@/lib/store/authStore";

const SignUp = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const setUser = useAuthStore((state) => state.setUser)


  const handleSubmit = async (formData: FormData) => {
    try {
      const formValues = Object.fromEntries(formData) as RegisterRequest;
      const res = await register(formValues);
      if (res) {
	      setUser(res)
        router.push('/profile');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          'Oops... some error'
      )
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
export default SignUp;