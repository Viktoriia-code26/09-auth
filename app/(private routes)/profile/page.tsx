import css from "./ProfilePage.module.css";
import Link from "next/link";
import Image from "next/image";
import { getServerMe } from "@/lib/api/serverApi";

export default async function Profile() {
  const user = await getServerMe();

  if (!user) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <p>Не удалось загрузить профиль. Пожалуйста, войдите снова.</p>
          <Link href="/sign-in" className={css.editProfileButton}>
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link
            href="/profile/edit"
            className={css.editProfileButton}
            prefetch={false}
          >
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.photoUrl || "/default-avatar.png"}
            alt={user.userName || "User Avatar"}
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.userName || "—"}</p>
          <p>Email: {user.email || "—"}</p>
        </div>
      </div>
    </main>
  );
}
