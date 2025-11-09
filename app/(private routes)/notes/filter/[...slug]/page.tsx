import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";

import NotesClient from "./Notes.client";
import type { Metadata } from "next";
import { fetchNotes } from "@/lib/api/serverApi";


interface FilteredNotesPageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: FilteredNotesPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tag = resolvedParams?.slug?.[0] ?? "all";
  const titleTag = tag === "all" ? "All Notes" : `Notes tagged "${tag}"`;

  return {
    title: titleTag,
    description: `Browse your notes filtered by tag: ${tag}.`,
    openGraph: {
      title: titleTag,
      description: `Browse your notes filtered by tag: ${tag}.`,
      url: `https://notehub.com/notes/filter/${tag}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: titleTag,
        },
      ],
      type: "website",
    },
  };
}


export default async function FilteredNotesPage({ params }: FilteredNotesPageProps) {
  const resolvedParams = await params;
  const tag = resolvedParams?.slug?.[0] ?? "all";

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", tag, 1],
    queryFn: () => fetchNotes({ tag: tag === "all" ? undefined : tag, currentPage: 1 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={tag} />
    </HydrationBoundary>
  );
}
