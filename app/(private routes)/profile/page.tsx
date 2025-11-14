import { getServerMe } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Profile | NoteHub",
  description: "Перегляд особистих даних користувача.",
};

export default async function ProfilePage() {
  const user = await getServerMe();

  if (!user) {
    return (
      <main className={css.mainContent}>
        <p>You are not authenticated.</p>
        <Link href="/sign-in">Go to Sign In</Link>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar ?? "/default-avatar.png"}
            alt="Profile photo"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </div>
    </main>
  );
}
