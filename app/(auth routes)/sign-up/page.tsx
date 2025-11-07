"use client";
import { useState } from "react";
import { register } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import css from "./SignUpPage.module.css";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    userName: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      router.push("/profile");
    } catch (err: unknown) {
      console.error(err);
      setError("Ошибка регистрации");
    }
  };

  return (
    <main className={css.mainContent}>
      <form onSubmit={handleSubmit} className={css.form}>
        <h1 className="formTitle">Sign Up</h1>
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
          name="userName"
          type="text"
          placeholder="Username (optional)"
          value={form.userName}
          onChange={handleChange}
          className={css.input}
        />

        {error && <p className={css.error}>{error}</p>}

        <button
          type="submit"
          className={css.submitButton}
        >
          Register
        </button>
      </form>
    </main>
  );
}
