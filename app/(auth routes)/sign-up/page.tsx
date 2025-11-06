// app/(public routes)/sign-up/page.tsx


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { register, RegisterRequest } from '@/lib/api/clientApi';

import css from "./SignUpPage.module.css"
import { ApiError } from '@/lib/api/api';


const SignUp = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  // Отримуємо метод із стора
  const setUser = useAuthStore((state) => state.setUser)


  const handleSubmit = async (formData: FormData) => {
    try {
      const formValues = Object.fromEntries(formData) as RegisterRequest;
      const res = await register(formValues);

      if (!/\S+@\.S+/.test(formValues.email)) {
        setError("Please enter a valid email address");
        return;
      }

      if (res) {
	      // Записуємо користувача у глобальний стан
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
    <div className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form action={handleSubmit} className={css.form}>
        <label className={css.formGroup}>
          Username
          <input type="text" name="userName" className={css.input} required />
        </label>
        <label className={css.formGroup}>
          Email
          <input
            type="email"
            name="email"
            required
            className={css.input} />
        </label>
        <label className={css.formGroup}>
          Password
          <input type="password" name="password" required className={css.input } />
        </label>
        <button type="submit" className={css.submitButton}>Register</button>
      </form>
      {error && <p className={css.error}>{error}</p>}
    </div>
  );
};


export default SignUp;