"use client";

import css from "./EditProfilePage.module.css";
import { useRouter } from "next/navigation";
import { getMe, updateMe } from "@/lib/api/clientApi";
import { useEffect, useState } from "react";
import AvatarPicker from "@/components/AvatarPicker/AvatarPicker";
import type { User } from "@/types/user";

export default function EditProfilePage() {
  const router = useRouter();

  const [userName, setUserName] = useState<string>(""); // ✅ строго string
  const [email, setEmail] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Загружаем данные пользователя при открытии страницы
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getMe();

        if (!user) {
          console.warn("User is not logged in");
          router.replace("/sign-in");
          return;
        }

        // ✅ оператор ?? гарантирует string
        setUserName(user.username ?? "");
        setEmail(user.email ?? "");
        setAvatar(user.avatar ?? "");
      } catch (error) {
        console.error("Failed to load user:", error);
        router.replace("/sign-in");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // Обработчик изменения username
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  // ✅ Сохранение изменений
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Формируем данные для отправки
      const formData = new FormData();
      formData.append("username", userName);
      if (imageFile) formData.append("avatar", imageFile);

      // Отправляем PATCH-запрос
      const updatedUser: User = await updateMe(formData);

      // ✅ Обновляем локальный стейт (и гарантируем строки)
      setUserName(updatedUser.username ?? "");
      setAvatar(updatedUser.avatar ?? "");

      // ✅ Обновляем cookie (если нужно SSR)
      const token = localStorage.getItem("token");
      if (token) {
        document.cookie = `accessToken=${token}; path=/; SameSite=Lax`;
        document.cookie = `token=${token}; path=/; SameSite=Lax`;
      }

      // ✅ Обновляем страницу (чтобы SSR подхватил новые данные)
      window.location.replace("/profile");
    } catch (err) {
      console.error("Ошибка сохранения профиля:", err);
      alert("Не удалось сохранить изменения");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  // Индикатор загрузки
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <main>
      <AvatarPicker
        profilePhotoUrl={avatar}
        onChangePhoto={(urlOrFile) => {
          if (typeof urlOrFile === "string") {
            setAvatar(urlOrFile);
          } else {
            setImageFile(urlOrFile);
          }
        }}
      />

      <form onSubmit={handleSave} className={css.profileInfo}>
        <div className={css.usernameWrapper}>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={userName}
            onChange={handleChange}
            className={css.input}
            required
            minLength={2}
          />
        </div>

        <p>Email: {email}</p>

        <div className={css.actions}>
          <button type="submit" className={css.saveButton} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className={css.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
