/* eslint-disable @next/next/no-img-element */
import { getServerMe } from "@/lib/api/serverApi";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await getServerMe();
  if (!user) return null;

  return (
    <main style={{ padding: 24 }}>
      <h1>My Profile</h1>

      {user.avatar && (
        <img
          src={user.avatar}
          alt="avatar"
          style={{ width: 120, height: 120, borderRadius: "50%" }}
        />
      )}

      <p>Email: {user.email}</p>
      <p>Username: {user.username}</p>

      <Link href="/profile/edit">Edit profile</Link>
    </main>
  );
}
