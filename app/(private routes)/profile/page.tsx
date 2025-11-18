import Image from "next/image";
import Link from "next/link";
import { getServerMe } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile — NoteHub",
  description: "View your profile information in NoteHub.",
};

export default async function ProfilePage() {
  const user = await getServerMe();
  if (!user) return null; 

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>

          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar ?? "/default-avatar.png"}
            alt={user.username ?? "User Avatar"}
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <div className={css.profileInfo}>
          <p className={css.userWrapper}>
            <strong>Username:</strong> {user.username}
          </p>
          <p className={css.userWrapper}>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      </div>
    </main>
  );
}
