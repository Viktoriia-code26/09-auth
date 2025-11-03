
import css from "../../../sidebarNotes.module.css";
import Link from "next/link";

const TAGS = ["Work", "Personal", "Meeting", "Shopping", "Todo"];

interface SidebarNotesProps {
  currentTag?: string;
}

export default function SidebarNotes({ currentTag = "all" }: SidebarNotesProps) {
  const normalizedTag = currentTag.toLowerCase();

  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <Link
          href="/notes/filter/all"
          className={`${css.menuLink} ${normalizedTag === "all" ? css.active : ""}`}
        >
          All notes
        </Link>
      </li>

      {TAGS.map((tag) => (
        <li
          key={tag}
          className={`${css.menuItem} ${
            normalizedTag === tag.toLowerCase() ? css.active : ""
          }`}
        >
          <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
