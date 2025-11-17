/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import css from "./ProfileEditPage.module.css";

import AvatarPicker from "@/components/AvatarPicker/AvatarPicker";
import { uploadImage, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [username, setUsername] = useState(user?.username ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar ?? null);
  
  if (!user) return <p className={css.loading}>Loading...</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload: { username?: string; avatar?: string } = {};

      if (username && username !== user.username) {
        payload.username = username;
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
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={css.container}>
      <h1 className={css.title}>Edit Profile</h1>

      <section className={css.editor}>
     <AvatarPicker
  profilePhotoUrl={avatarUrl ?? undefined}
  onChangePhoto={setAvatarUrl}
/>
        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <label className={css.label}>
            Username
            <input
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          {error && <p className={css.error}>{error}</p>}

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancel}
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </button>

            <button type="submit" className={css.save} disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
