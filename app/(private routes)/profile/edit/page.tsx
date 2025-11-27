/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import css from "./EditProfilePage.module.css";
import { uploadImage, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import Image from "next/image";

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [username, setUsername] = useState(user?.username ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar ?? null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  if (!user) return <p className={css.loading}>Loading...</p>;

  const handleSubmit = async (formData: FormData) => {
  try {
    setError("");

    const newUsername = (formData.get("username") as string).trim();
    const payload: { username?: string; avatar?: string } = {};

  
    if (newUsername && newUsername !== user.username) {
        payload.username = newUsername;
      }

    if (imageFile) {
      const url = await uploadImage(imageFile);
      payload.avatar = url;
    }

    if (Object.keys(payload).length > 0) {
      const updatedUser = await updateMe(payload);
      setUser(updatedUser);
    }

    router.push("/profile");
  } catch {
    setError("Failed to update profile. Please try again.");
  }
};

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar ?? "/default-avatar.png"}
          alt={user.username ?? "User Avatar"}
          width={120}
          height={120}
          className={css.avatar}
          priority
        />

        <form className={css.profileInfo} action={handleSubmit}>
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

          <p>Email: {user.email}</p>

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
