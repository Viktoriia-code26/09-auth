// components/Header/Header.tsx
"use client";

import Link from "next/link";
import css from "./Header.module.css";
import AuthNavigation from "../AuthNavigation/AuthNavigation";

const Header = () => {
  return (
    <header className={css.header}>
      <Link href="/" prefetch={false} aria-label="Home">
        NoteHub
      </Link>

      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/" prefetch={false}>Home</Link>
          </li>
          <li>
            <Link href="/notes/filter/all" prefetch={false}>Notes</Link>
          </li>
          <AuthNavigation/>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
