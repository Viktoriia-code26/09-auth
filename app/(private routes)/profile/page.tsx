// app/(private routes)/profile/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getServerMe } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";
import type { Metadata } from "next";
import UnauthorizedMessage from "@/components/UnathorizedMessage/UnathoraizedMessage";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "Персональна сторінка користувача з інформацією облікового запису.",
};

export default async function ProfilePage() {
  const user = await getServerMe();

  if (!user) {
  
    return <UnauthorizedMessage />;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Профіль користувача</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Редагувати профіль
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt={user.username || "User Avatar"}
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>
            <strong>Ім’я користувача:</strong> {user.username || "—"}
          </p>
          <p>
            <strong>Email:</strong> {user.email || "—"}
          </p>
        </div>
      </div>
    </main>
  );
}
