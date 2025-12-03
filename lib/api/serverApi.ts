import { nextServer } from "./api";
import { cookies } from "next/headers";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";


async function buildCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  const all = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  return all;
}


export async function getServerMe(): Promise<User | null> {
  try {
    const cookieHeader = await buildCookieHeader();

    const res = await nextServer.get("/users/me", {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return res.data;
  } catch {
    return null;
  }
}


export async function checkServerSession() {
  const cookieHeader = await buildCookieHeader();

  return nextServer.get("/auth/session", {
    headers: {
      Cookie: cookieHeader,
    },
  });
}


export async function fetchNotes(params?: {
  query?: string;
  tag?: string;
  page?: number;
  perPage?: number;
}): Promise<{ notes: Note[]; totalPages: number } | null> {
  try {
    const cookieHeader = await buildCookieHeader();

    const res = await nextServer.get("/notes", {
      headers: {
        Cookie: cookieHeader,
      },
      params: {
        search: params?.query,
        tag: params?.tag,
        page: params?.page ?? 1,
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
    const cookieHeader = await buildCookieHeader();
    const res = await nextServer.get(`/notes/${id}`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return res.data;
  } catch {
    return null;
  }
}
