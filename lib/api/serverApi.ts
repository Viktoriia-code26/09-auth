import { cookies } from "next/headers";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";
import { nextServer } from "./api";
import { AxiosError } from "axios";


export const getServerMe = async (): Promise<User | null> => {
  const cookieStore = await cookies();

 
  const cookieHeader = Array.from(cookieStore.getAll())
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  if (!cookieHeader.includes("token") && !cookieHeader.includes("accessToken")) {
    console.warn("⚠️ No auth cookies found (SSR)");
    return null;
  }

  try {
    const res = await nextServer.get("/users/me", {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return res.data;

  } catch (error) {
    const err = error as AxiosError<unknown>;

    if (err.response?.status === 401) {
      console.warn("🔒 Unauthorized on SSR");
      return null;
    }

    console.error("❌ SSR getServerMe error:", err.message, err.response?.data);
    return null;
  }
};

export const fetchNoteById = async (id: string): Promise<Note | null> => {
  try {
    const res = await nextServer.get<Note>(`/notes/${id}`);
    return res.data;
  } catch {
    return null;
  }
};
export const checkSession = async () => {
  const cookieStore = await cookies();
  const res = await nextServer.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};

export const fetchNotes = async (params?: {
  query?: string;
  tag?: string;
  currentPage?: number;
  perPage?: number;
}): Promise<{ notes: Note[]; totalPages: number } | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    console.log("SSR: No token → public user → return empty notes");
    return { notes: [], totalPages: 0 }; 
  }

  try {
    const { data } = await nextServer.get("/notes", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        search: params?.query,
        tag: params?.tag,
        page: params?.currentPage ?? 1,
        perPage: params?.perPage ?? 12,
      },
    });

    return data;
  } catch (e) {
    const err = e as AxiosError;
    console.error(
      "Server fetchNotes error:",
      err.response?.status,
      err.response?.data
    );
    return null;
  }
};