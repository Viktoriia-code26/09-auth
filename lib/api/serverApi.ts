// lib/api/serverApi.ts
import { cookies } from "next/headers";
import { Note } from "@/types/note";
import { User } from "@/types/user";
import { createApi } from "./api";

// --- Notes --- //
export const fetchNotes = async ({
  query = "",
  tag,
  currentPage = 1,
  perPage = 12,
}: {
  query?: string;
  tag?: string;
  currentPage?: number;
  perPage?: number;
}) => {
  const cookieHeader = (await cookies()).getAll().map((c) => `${c.name}=${c.value}`).join("; ");
  const serverApi = createApi(cookieHeader);

  const { data } = await serverApi.get<{ notes: Note[]; totalPages: number }>("/notes", {
    params: { search: query || undefined, tag: tag || undefined, page: currentPage, perPage },
  });
  return data;
};

export const fetchNoteById = async (id: string) => {
  const cookieHeader = (await cookies()).getAll().map((c) => `${c.name}=${c.value}`).join("; ");
  const serverApi = createApi(cookieHeader);
  const { data } = await serverApi.get<Note>(`/notes/${id}`);
  return data;
};

// --- Auth --- //
export const checkSession = async (): Promise<boolean> => {
  try {
    const cookieHeader = (await cookies()).getAll().map((c) => `${c.name}=${c.value}`).join("; ");
    const serverApi = createApi(cookieHeader);
    const res = await serverApi.get("/auth/session");
    return res.data?.isAuthenticated ?? false;
  } catch (err) {
    console.error("checkSession error:", err);
    return false;
  }
};

export const getServerMe = async (): Promise<User | null> => {
  try {
    const cookieHeader = (await cookies()).getAll().map((c) => `${c.name}=${c.value}`).join("; ");
    const serverApi = createApi(cookieHeader);
    const { data } = await serverApi.get<User>("/users/me");
    return data;
  } catch (err) {
    console.error("getMe error:", err);
    return null;
  }
};
