'use client';

import css from "./EditProfilePage.module.css";
import { useRouter } from "next/navigation";
import { getMe, updateMe } from "@/lib/api/clientApi";
import { useEffect, useState } from "react";
import AvatarPicker from "@/components/AvatarPicker/AvatarPicker";

const EditProfilePage = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageFile, setImageFile] = useState<File | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSaving, setIsSaving] = useState(false);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getMe();
        setUserName(user.userName ?? '');
        setEmail(user.email ?? '');
        setPhotoUrl(user.photoUrl ?? '');
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  
  const handleSaveUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await updateMe({ userName });
      router.push("/profile"); 
    } catch (error) {
      console.error("Oops, some error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  return (
    <main>
      <AvatarPicker profilePhotoUrl={photoUrl} onChangePhoto={setImageFile} />
      <form onSubmit={handleSaveUser} className={css.profileInfo}>
      <div className={css.usernameWrapper}>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={userName}
          onChange={handleChange}
          className={css.input}
          required
          minLength={2} />
      </div>

      <p>Email: {email}</p>

      <div className={css.actions}>
        <button type="submit" className={css.saveButton}>
          Save
        </button>
        <button type="button" onClick={handleCancel} className={css.cancelButton}>
          Cancel
        </button>
      </div>
      </form>
    </main>
  );
};

export default EditProfilePage;
