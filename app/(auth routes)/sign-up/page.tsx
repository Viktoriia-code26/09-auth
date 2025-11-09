"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api/clientApi";
import axios from "axios";
import type { RegisterRequest } from "@/lib/api/clientApi";
import css from "./SignUpPage.module.css";

export default function SignUpPage() {
  const router = useRouter();

  // 👇 username теперь опционален
  const [form, setForm] = useState<RegisterRequest>({
    email: "",
    password: "",
    username: "", // не обязателен
  });

  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      // 👇 если username пустой — не отправляем его вообще
      const payload: RegisterRequest = {
        email: form.email,
        password: form.password,
        ...(form.username ? { username: form.username } : {}),
      };

      await register(payload);
      alert("Регистрация успешна!");
      router.push("/sign-in");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 409) {
          setError("Такой email уже зарегистрирован");
        } else {
          setError(err.response?.data?.message ?? "Ошибка при регистрации");
        }
      } else {
        console.error("Неизвестная ошибка регистрации:", err);
        setError("Непредвиденная ошибка при регистрации");
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <form onSubmit={handleSubmit} className={css.form}>
        <h1 className={css.formTitle}>Sign Up</h1>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className={css.input}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className={css.input}
        />

        <input
          name="username"
          type="text"
          placeholder="Username (optional)"
          value={form.username}
          onChange={handleChange}
          className={css.input}
        />

        {error && <p className={css.error}>{error}</p>}

        <button type="submit" className={css.submitButton}>
          Register
        </button>
      </form>
    </main>
  );
}
