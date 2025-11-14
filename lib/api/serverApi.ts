// lib/api/serverApi.ts
import { cookies } from "next/headers";
import { nextServer } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";
import type { AxiosError } from "axios";

/* ----------------------------- BUILD COOKIE HEADER ----------------------------- */

export async function buildCookieHeader(): Promise<string> {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
}



export const getServerMe = async (): Promise<User | null> => {
  const cookieHeader = await buildCookieHeader();

  if (!cookieHeader.includes("token")) {
    console.warn("⚠️ No auth cookie — guest user (SSR)");
    return null;
  }

  try {
    const res = await nextServer.get<User>("/users/me", {
      headers: { Cookie: cookieHeader },
    });

    return res.data;
  } catch (error) {
    const err = error as AxiosError;

    if (err.response?.status === 401) {
      console.warn("🔒 Unauthorized on SSR");
      return null;
    }

    console.error("❌ SSR getServerMe error:", err.response?.data);
    return null;
  }
};



export const checkSession = async () => {
  const cookieHeader = await buildCookieHeader();

  return nextServer.get("/auth/session", {
    headers: { Cookie: cookieHeader },
  });
};



export const fetchNotes = async (params?: {
  query?: string;
  tag?: string;
  currentPage?: number;
  perPage?: number;
}): Promise<{ notes: Note[]; totalPages: number } | null> => {
  const cookieHeader = await buildCookieHeader();

  try {
    const res = await nextServer.get("/notes", {
      headers: { Cookie: cookieHeader },
      params: {
        search: params?.query,
        tag: params?.tag,
        page: params?.currentPage ?? 1,
        perPage: params?.perPage ?? 12,
      },
    });

    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Server fetchNotes error:", err.response?.status, err.response?.data);
    return null;
  }
};

export const fetchNoteById = async (id: string): Promise<Note | null> => {
  const cookieHeader = await buildCookieHeader();

  try {
    const res = await nextServer.get<Note>(`/notes/${id}`, {
      headers: { Cookie: cookieHeader },
    });

    return res.data;
  } catch {
    return null;
  }
};
