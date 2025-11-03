import { create } from 'zustand';
import { NewNoteData } from '../../types/note';
import { persist, createJSONStorage } from 'zustand/middleware';

type NoteDraftStore = {
  draft: NewNoteData;
  setDraft: (note: Partial<NewNoteData>) => void; 
  clearDraft: () => void;
};

const initialDraft: NewNoteData = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) =>
        set((state) => ({
          draft: { ...state.draft, ...note }, 
        })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      name: 'note-draft',
      storage: createJSONStorage(()=>localStorage),
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
