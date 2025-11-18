"use client";

import css from "../../NotesPage.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDebounce } from "use-debounce";
import Link from "next/link";

import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { fetchNotes } from "@/lib/api/clientApi";


interface NotesClientProps {
  initialTag?: string;
}

export default function NotesClient({ initialTag }: NotesClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 600);
  const [currentPage, setCurrentPage] = useState(1);
  const [tag, setTag] = useState<string>(initialTag || "all");
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const [page, setPage] = useState(1);

  useEffect(() => {
    if (initialTag) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTag(initialTag);
      setCurrentPage(1);
      setSearchTerm("");
    }
  }, [initialTag]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setCurrentPage(1);
  };

const { data, isLoading, error, isFetching } = useQuery({
  queryKey: ["notes", debouncedSearch, tag, page],
  queryFn: () =>
    fetchNotes({
      query: debouncedSearch,
      tag: tag === "all" ? undefined : tag,
      page,
    }),
  placeholderData: keepPreviousData,
});

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} searchQuery={searchTerm} />

        {totalPages > 1 && notes.length > 0 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          + Create Note
        </Link>
      </header>

      <main className={css.main}>
        {(isLoading || isFetching) && <Loader />}
        {error && <ErrorMessage />}

        {!isLoading && notes.length > 0 ? (
          <NoteList notes={notes} />
        ) : (
          !isLoading && <p className={css.empty}>No notes found for {tag}.</p>
        )}
      </main>

      <Toaster position="top-right" />
    </div>
  );
}
