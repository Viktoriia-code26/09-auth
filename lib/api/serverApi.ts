// lib/api/serverApi.ts
import { nextServer } from "./api";
import { cookies } from "next/headers";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

async function buildCookieHeader() {
  const cookieStore = await cookies();
  return cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
}

// ======= AUTH SSR =======

export async function getServerMe(): Promise<User | null> {
  try {
    const { data } = await nextServer.get("/users/me", {
      headers: { Cookie: await buildCookieHeader() },
    });
    return data;
  } catch {
    return null;
  }
}

export const checkServerSession = async () => {
  const res = await nextServer.get("/auth/session", {
    headers: { Cookie: await buildCookieHeader() },
  });
  return res.data;
};

// ======= NOTES SSR =======

export async function fetchNotes(params?: {
  query?: string;
  tag?: string;
  currentPage?: number;
  perPage?: number;
}): Promise<{ notes: Note[]; totalPages: number } | null> {
  try {
    const res = await nextServer.get("/notes", {
      headers: { Cookie: await buildCookieHeader() },
      params: {
        search: params?.query,
        tag: params?.tag,
        page: params?.currentPage ?? 1,
        perPage: params?.perPage ?? 12,
      },
    });
    return res.data;
  } catch {
    return null;
  }
}

export async function fetchNoteById(id: string): Promise<Note | null> {
  try {
    const res = await nextServer.get(`/notes/${id}`, {
      headers: { Cookie: await buildCookieHeader() },
    });
    return res.data;
  } catch {
    return null;
  }
}
