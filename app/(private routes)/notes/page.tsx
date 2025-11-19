// app/notes/page.tsx
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { fetchNotes } from "@/lib/api/serverApi";
import NotesClient from "./filter/[...slug]/Notes.client";

export const metadata: Metadata = {
  title: "All Notes | NoteHub",
  description: "View and manage all your saved notes in one place.",
  openGraph: {
    title: "All Notes | NoteHub",
    description: "View and manage all your saved notes in one place.",
    url: "https://notehub.com/notes",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub Notes Page",
      },
    ],
    type: "website",
  },
};

export default async function NotesPage() {
  const queryClient = new QueryClient();

await queryClient.prefetchQuery({
  queryKey: ["notes", { query: "", tag: "", page: 1, perPage: 12 }],
  queryFn: () =>
    fetchNotes({
      query: "",
      tag: "",
      page: 1,       
      perPage: 12,
    }),
});


  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient />
    </HydrationBoundary>
  );
}
