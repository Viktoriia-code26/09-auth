"use client";

import NoteForm from "@/components/NoteForm/NoteForm";
import NoteModal from "@/components/Modal/Modal";
import css from "./CreateNote.module.css";

export default function CreateNoteClient() {
  const handleClose = () => window.history.back();
  const handleSuccess = () => (window.location.href = "/notes");

  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create Note</h1>
        <NoteModal open={true} onClose={handleClose}>
          <NoteForm onClose={handleClose} onSuccess={handleSuccess} />
        </NoteModal>
      </div>
    </main>
  );
}
