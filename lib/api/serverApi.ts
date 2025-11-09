import { cookies } from "next/headers";
import type { AxiosError } from "axios";
import { createServerApi } from "./api";
import { User } from "@/types/user";
import { Note } from "@/types/note";

/* ---------- Проверка сессии ---------- */
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

/* ---------- Получение текущего пользователя ---------- */
export const getServerMe = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("accessToken")?.value ||
      cookieStore.get("token")?.value;

    console.log("SSR token:", token ? "✅ есть" : "❌ нет");

    if (!token) return null;

    const api = await createServerApi();
    const { data } = await api.get<User>("/users/me");

    return data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      "getServerMe error:",
      err.response?.status || "unknown",
      err.response?.data || err.message
    );
    return null;
  }
};

/* ---------- Получение всех заметок ---------- */
export const fetchServerNotes = async (params?: {
  query?: string;
  tag?: string;
  currentPage?: number;
  perPage?: number;
}): Promise<{ notes: Note[]; totalPages: number } | null> => {
  try {
    const api = await createServerApi();
    const { data } = await api.get<{ notes: Note[]; totalPages: number }>("/notes", {
      params: {
        search: params?.query || undefined,
        tag: params?.tag || undefined,
        page: params?.currentPage || 1,
        perPage: params?.perPage || 12,
      },
    });
    return data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("fetchServerNotes error:", err.response?.status, err.response?.data || err.message);
    return null;
  }
};

/* ---------- Получение заметки по ID ---------- */
export const fetchServerNoteById = async (id: string): Promise<Note | null> => {
  try {
    const api = await createServerApi();
    const { data } = await api.get<Note>(`/notes/${id}`);
    return data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("fetchServerNoteById error:", err.response?.status, err.response?.data || err.message);
    return null;
  }
};
