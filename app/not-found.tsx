
import RedirectTimer from "./404/RedirectTimer";
import css from "./home.module.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "404 - Page Not Found | NoteHub",
  description: "The page you're looking for doesn't exist. Return to the homepage of NoteHub.",
  openGraph: {
    title: "404 - Page Not Found | NoteHub",
    description: "The page you're looking for doesn't exist. Return to the homepage of NoteHub.",
    url: "https://notehub.com/404",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub 404 Page",
      },
    ],
    type: "website",
  },
};

export default function NotFound() {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404 - Page Not Found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
      <p className={css.redirect}>
        Redirecting you to the homepage...
      </p>
      <RedirectTimer/>
    </div>
  );
}
