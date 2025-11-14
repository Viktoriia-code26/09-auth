import { getServerMe } from "@/lib/api/serverApi";
import Link from "next/link";
import Image from "next/image";
import css from "./ProfilePage.module.css";

export default async function ProfilePage() {
  const user = await getServerMe();

  if (!user) {
    return (
      <main className={css.mainContent}>
        <p className={css.error}>
          Ви не авторизовані.{" "}
          <Link href="/sign-in" className={css.link}>
            Увійдіть
          </Link>{" "}
          у систему.
        </p>
      </main>
    );
  }

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
            src={user.avatar || "/default-avatar.png"}
            alt={user.username || "User Avatar"}
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>
            <strong>Username:</strong> {user.username || "—"}
          </p>
          <p>
            <strong>Email:</strong> {user.email || "—"}
          </p>
        </div>
      </div>
    </main>
  );
}
