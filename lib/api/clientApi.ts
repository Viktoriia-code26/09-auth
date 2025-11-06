// lib/api/clientApi.ts
import { api } from "./api";
import { User } from "@/types/user";
import { Note, NewNoteData } from "@/types/note";

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
  const { data } = await api.get<{ notes: Note[]; totalPages: number }>("/notes", {
    params: {
      search: query || undefined,
      tag: tag || undefined,
      page: currentPage,
      perPage,
    },
  });
  return data;
};

export const fetchNoteById = async (id: string) => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (newNoteData: NewNoteData) => {
  const { data } = await api.post<Note>("/notes", newNoteData);
  return data;
};

export const deleteNote = async (id: string) => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

// --- Auth --- //
export type RegisterRequest = { email: string; password: string };
export const register = async (data: RegisterRequest) => {
  console.log(data);
  const res = await api.post<User>("/auth/register", data,
  //   headers: {
  //   "Content-Type": "application/json",
  // },
  )
  return res.data;
};

export type LoginRequest = { email: string; password: string };
export const login = async (data: LoginRequest) => {
  const res = await api.post<User>("/auth/login", data);
  return res.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
};

export const checkSession = async () => {
  const res = await api.get<User | null>("/auth/session");
  return res.data;
};

export const getMe = async () => {
  const { data } = await api.get<User>("/users/me");
  return data;
};

export const updateMe = async (payload: Partial<User>) => {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
};
