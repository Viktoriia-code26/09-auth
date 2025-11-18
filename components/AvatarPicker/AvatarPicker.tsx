// "use client";

// import { useRef, useState } from "react";
// import Image from "next/image";
// import { uploadImage } from "@/lib/api/clientApi";
// import css from "./AvatarPicker.module.css"

// type Props = {
//   profilePhotoUrl?: string | null;
//   onChangePhoto: (url: string | null) => void;
// };

// export default function AvatarPicker({ profilePhotoUrl, onChangePhoto }: Props) {
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const [uploading, setUploading] = useState(false);

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] ?? null;
//     if (!file) return;

//     try {
//       setUploading(true);
//       const url = await uploadImage(file);
//       onChangePhoto(url);
//     } catch (e) {
//       console.error("Avatar upload failed:", e);
//       onChangePhoto(null);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className={css.picker}>
//       <div className={css.wrapper}>
//         {profilePhotoUrl ? (
//           <Image
//             src={profilePhotoUrl}
//             alt="Avatar"
//             width={120}
//             height={120}
//             loading="eager"
//             className={css.avatar}
//           />
//         ) : (
//           <div className={css.avatar} />
//         )}
//       </div>

//       <button
//         type="button"
//         onClick={() => fileInputRef.current?.click()}
//         className={css.input}
//         disabled={uploading}
//       >
//         {uploading ? "Uploading..." : "Change photo"}
//       </button>

//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         className={css.input}
//         onChange={handleFileChange}
//       />
//     </div>
//   );
// }
