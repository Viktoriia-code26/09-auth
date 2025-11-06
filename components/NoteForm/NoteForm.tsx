"use client";

import { useState } from "react";
import type { NoteTag } from "../../types/note";
import { useNoteDraftStore } from "@/lib/store/noteStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteForm.module.css";
import { useRouter } from "next/navigation";
import { createNote } from "@/lib/api/clientApi";

const allTags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

interface NoteFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function NoteForm({ onSuccess }: NoteFormProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (newNote: typeof draft) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      onSuccess();
      router.push(`/notes/filter/all`); 
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    mutation.mutate(draft, { onSettled: () => setIsSubmitting(false) });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDraft({ ...draft, [name]: value });
  };
  const handleCancel = () => router.push('/notes/filter/all');
  
  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={draft?.title}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={50}
          className={css.input}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content (optional)</label>
        <textarea
          id="content"
          name="content"
          value={draft?.content}
          onChange={handleChange}
          rows={8}
          maxLength={500}
          className={css.textarea}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          value={draft?.tag}
          onChange={handleChange}
          required
          className={css.select}
        >
          <option value="">Select tag</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
