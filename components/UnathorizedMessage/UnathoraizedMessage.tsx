'use client';

import Link from "next/link";
import css from "./UnathorizedMessage.module.css"

export default function UnauthorizedMessage() {
  return (
    <main className={css.mainContent}>
      <p className={css.error}>
        Ви не авторизовані.{" "}
        <Link href="/sign-in" className={css.loginLink}>
          Увійдіть
        </Link>{" "}
        у систему.
      </p>
    </main>
  );
}
