import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import { Roboto } from "next/font/google";
import { Metadata } from "next";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap",
});
export const metadata: Metadata = {
  title: "NoteHub",
  description: "Create and manage your notes easily with NoteHub.",
  openGraph: {
    title: "NoteHub",
    description: "Create and manage your notes easily with NoteHub.",
    url: "https://notehub.com",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub App",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <div id="modal-root"></div>
        <TanStackProvider>
          <Header />
          <main>
            {children}
            {modal}
          </main>
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
