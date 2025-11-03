import type { Metadata } from "next";
import CreateNoteClient from "@/components/CreateNoteClient/CreateNoteClient"; 

export const metadata: Metadata = {
  title: "Create a New Note | NoteHub",
  description: "Create a new note and save it to your collection.",
  openGraph: {
    title: "Create a New Note | NoteHub",
    description: "Quickly create and save your new note in NoteHub.",
    url: "https://notehub.com/notes/action/create",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Create Note",
      },
    ],
    type: "website",
  },
};

export default function CreateNotePage() {
  return <CreateNoteClient />;
}
