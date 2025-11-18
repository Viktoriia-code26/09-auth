// lib/api/serverApi.ts
import { nextServer } from "./api";
import { cookies } from "next/headers";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

// Собираем Cookie header типа: "accessToken=abc; refreshToken=xyz"
async function buildCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

// ======== AUTH SSR ========

export async function getServerMe(): Promise<User | null> {
  try {
    const cookieHeader = await buildCookieHeader();
    const { data } = await nextServer.get("/users/me", {
      headers: { Cookie: cookieHeader },
    });
    return data;
  } catch {
    return null;
  }
}

export async function checkServerSession(cookieHeader: string) {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/auth/session",
    {
      method: "GET",
      headers: { Cookie: cookieHeader },
    }
  );

  return res;
}

// ======== NOTES SSR ========

export async function fetchNotes(params?: {
  query?: string;
  tag?: string;
  page?: number;
  perPage?: number;
}): Promise<{ notes: Note[]; totalPages: number } | null> {
  try {
    const cookieHeader = await buildCookieHeader();

    const { data } = await nextServer.get("/notes", {
      headers: { Cookie: cookieHeader },
      params,
    });

    return data;
  } catch {
    return null;
  }
}

export async function fetchNoteById(id: string): Promise<Note | null> {
  try {
    const cookieHeader = await buildCookieHeader();

    const { data } = await nextServer.get(`/notes/${id}`, {
      headers: { Cookie: cookieHeader },
    });

    return data;
  } catch {
    return null;
  }
}
