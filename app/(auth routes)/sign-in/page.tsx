// app/(public routes)/sign-in/page.tsx


'use client';


import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { login, LoginRequest } from '@/lib/api/clientApi';
import { ApiError } from '@/lib/api/api';
import css from "./SignInPage.module.css"


const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const setUser = useAuthStore((state) => state.setUser)
  
  const handleSubmit = async (formData: FormData) => {
    try {
      const formValues = Object.fromEntries(formData) as LoginRequest;
      const res = await login(formValues);
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
    <form action={handleSubmit} className={css.form}>
      <h1 className={css.formTitle}>Sign in</h1>
      <label className={css.formGroup}>
        Email
        <input type="email" name="email" required className={css.input } />
      </label>
      <label className={css.formGroup}>
        Password
        <input type="password" name="password" required className={css.input } />
      </label>
      <button type="submit" className={css.submitButton}>Log in</button>
      {error && <p className={css.error}>{error}</p>}
    </form>
  );
};

export default SignIn;