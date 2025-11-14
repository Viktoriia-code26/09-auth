"use client";

import { useRef } from "react";
import Image from "next/image";

type Props = {
  profilePhotoUrl?: string;
  onChangePhoto: (file: File | null) => void;
};

export default function AvatarPicker({ profilePhotoUrl, onChangePhoto }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChangePhoto(file);
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
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              backgroundColor: "#ddd",
            }}
          />
        )}
      </div>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="px-3 py-1 rounded bg-blue-500 text-white text-sm"
      >
        Change photo
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
