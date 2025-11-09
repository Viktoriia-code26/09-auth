'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import css from "./AvatarPicker.module.css";

type Props = {
  profilePhotoUrl?: string;
  onChangePhoto: (url: string | null) => void; // теперь передаём URL
};

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/<твое_имя_облака>/upload";
const CLOUDINARY_PRESET = "<твой_upload_preset>"; // предварительно создай его в Cloudinary Dashboard

const AvatarPicker = ({ profilePhotoUrl, onChangePhoto }: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (profilePhotoUrl) {
      setPreviewUrl(profilePhotoUrl);
    }
  }, [profilePhotoUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError("");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Max file size is 5MB");
      return;
    }

  
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);

  
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_PRESET);

      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        onChangePhoto(data.secure_url); 
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChangePhoto(null);
    setPreviewUrl("");
  };

  return (
    <div>
      <div className={css.picker}>
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        ) : (
          <div className={css.avatarPlaceholder}>No photo</div>
        )}

        <label className={previewUrl ? `${css.wrapper} ${css.reload}` : css.wrapper}>
          📷 Choose photo
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={css.input}
          />
        </label>

        {previewUrl && (
          <button className={css.remove} onClick={handleRemove} disabled={isUploading}>
            ❌
          </button>
        )}
      </div>

      {error && <p className={css.error}>{error}</p>}
      {isUploading && <p className={css.uploading}>Uploading...</p>}
    </div>
  );
};

export default AvatarPicker;
