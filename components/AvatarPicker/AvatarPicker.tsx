// components/AvatarPicker/AvatarPicker.tsx

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
 import css from "./AvatarPicker.module.css"
type Props = {
    profilePhotoUrl?: string;
    onChangePhoto: (file: File | null) => void;
};

const AvatarPicker = ({ profilePhotoUrl, onChangePhoto }: Props) => {
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (profilePhotoUrl) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPreviewUrl(profilePhotoUrl);
        }
    }, [profilePhotoUrl]
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setError('');

        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Only images');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError('Max file size 5MB');
                return;
            }
            onChangePhoto(file)
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        onChangePhoto(null);
        setPreviewUrl('');
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
          <input type="file" accept="image/*" onChange={handleFileChange} className={css.input} />
        </label>
        {previewUrl && (
          <button className={css.remove} onClick={handleRemove}>
            ❌
          </button>
        )}
      </div>
      {error && <p className={css.error}>{error}</p>}
    </div>
  );
};

export default AvatarPicker;
 {/* <img src="avatar"
      alt="User Avatar"
      width={120}
      height={120}
      className={css.avatar}
    /> */}
