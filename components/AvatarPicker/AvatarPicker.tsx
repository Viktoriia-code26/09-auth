"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/lib/api/clientApi";

type Props = {
  profilePhotoUrl?: string | null;
  onChangePhoto: (url: string | null) => void;
};

export default function AvatarPicker({ profilePhotoUrl, onChangePhoto }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImage(file);
      onChangePhoto(url);
    } catch (e) {
      console.error("Avatar upload failed:", e);
      onChangePhoto(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div>
        {profilePhotoUrl ? (
          <Image
            src={profilePhotoUrl}
            alt="Avatar"
            width={120}
            height={120}
            loading="eager"
            className="rounded-full object-cover"
          />
        ) : (
          <div className="rounded-full bg-gray-300" style={{ width: 120, height: 120 }} />
        )}
      </div>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="px-3 py-1 rounded bg-blue-500 text-white text-sm disabled:opacity-60"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Change photo"}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}
