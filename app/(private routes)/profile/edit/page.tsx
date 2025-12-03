"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import css from "./EditProfilePage.module.css";
import { updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, loading, setUser } = useAuthStore();

  const [username, setUsername] = useState(user?.username ?? "");
  const [error, setError] = useState("");

  if (loading) return <p className={css.loading}>Loading...</p>;
  if (!loading && !user) redirect("/sign-in");

  const handleSubmit = async () => {
    try {
      setError("");

      const trimmed = username.trim();
      const payload: { username?: string } = {};

      if (trimmed && trimmed !== user!.username) {
        payload.username = trimmed;
      }

      if (Object.keys(payload).length === 0) {
        return router.push("/profile");
      }

      const updatedUser = await updateMe(payload);
      setUser(updatedUser);

      router.push("/profile");
    } catch {
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <form
          className={css.profileInfo}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {user!.email}</p>

          {error && <p className={css.error}>{error}</p>}

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>

            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push("/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
