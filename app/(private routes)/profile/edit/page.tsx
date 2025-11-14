"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import type { User } from "@/types/user";
import AvatarPicker from "@/components/AvatarPicker/AvatarPicker";
import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const router = useRouter();

  const setUser = useAuthStore((s) => s.setUser);

  const [user, setUserLocal] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const current = await getMe();
      if (!current) {
        router.push("/sign-in");
        return;
      }
      setUserLocal(current);
      setUsername(current.username ?? "");
    };

    loadUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setError("");

    try {
      const updatedUser = await updateMe({
        username,
      });

      setUser(updatedUser);

      router.push("/profile");
    } catch (err) {
      console.error("Update profile error:", err);
      setError("Не удалось сохранить изменения");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <main className={css.mainContent}>
        <p>Loading profile...</p>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <AvatarPicker
          profilePhotoUrl={user.avatar ?? undefined}
          onChangePhoto={setImageFile}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={2}
              required
            />
          </div>

          <p>Email: {user.email}</p>

          {error && <p className={css.error}>{error}</p>}

          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
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
