
import type { AxiosError } from "axios";
import { createServerApi } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

export const checkSession = async (): Promise<boolean> => {
  try {
    const api = await createServerApi();
    const res = await api.get("/auth/session");
    return res.status === 200;
  } catch (error) {
    const err = error as AxiosError;
    console.error("checkSession error:", err.response?.status || err.message);
    return false;
  }
};

export const getServerMe = async (): Promise<User | null> => {
  try {
    const api = await createServerApi();
    const { data } = await api.get<User | null>("/users/me");
    if (!data) {
      console.log("🔒 No user data from /users/me (SSR). Returning null");
      return null;
    }
    return data;
  } catch (error) {
    const err = error as AxiosError;
    if (err.response?.status === 401) {
      console.log("⚠️ getServerMe → 401 Unauthorized (returning null)");
      return null;
    }
    console.error("getServerMe error:", err.message);
    return null;
  }
};

export const fetchNotes = async (params?: {
  query?: string;
  tag?: string;
  currentPage?: number;
  perPage?: number;
}): Promise<{ notes: Note[]; totalPages: number } | null> => {
  try {
    const api = await createServerApi();
    const { data } = await api.get<{ notes: Note[]; totalPages: number }>(
      "/notes",
      {
        params: {
          search: params?.query || undefined,
          tag: params?.tag || undefined,
          page: params?.currentPage || 1,
          perPage: params?.perPage || 12,
        },
      }
    );
    return data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      "fetchServerNotes error:",
      err.response?.status,
      err.response?.data || err.message
    );
    return null;
  }
};

export const fetchNoteById = async (id: string): Promise<Note | null> => {
  try {
    const api = await createServerApi();
    const { data } = await api.get<Note>(`/notes/${id}`);
    return data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      "fetchServerNoteById error:",
      err.response?.status,
      err.response?.data || err.message
    );
    return null;
  }
};
