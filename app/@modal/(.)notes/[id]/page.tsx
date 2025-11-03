import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import { fetchNoteById } from "@/lib/api";
import { Note } from "@/types/note";
import NotePreviewClient from "./NotePreview.client";


type Props = {
  params: Promise<{ id: string }>;
};

export default async function NotePreview({ params }: Props) {
  const { id } = await params;
  const queryClient = getQueryClient();


  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });


  const note = queryClient.getQueryData<Note>(["note", id]);
  if (!note) return <p>Note not found</p>;


  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient noteId={id} />
    </HydrationBoundary>
  );
}
