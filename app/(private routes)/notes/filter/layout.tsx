import { ReactNode } from "react";
import css from "../layoutNotes.module.css";

interface FilterLayoutProps {
  children: ReactNode;  
  sidebar: ReactNode;   
}

export default function FilterLayout({ children, sidebar}: FilterLayoutProps) {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>
        {sidebar}
      </aside>
      <main className={css.notesWrapper}>
        {children}
      </main>
    </div>
  );
}
