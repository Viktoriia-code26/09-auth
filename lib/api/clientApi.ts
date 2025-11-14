
import type { User } from "@/types/user";
import type { Note, NewNoteData } from "@/types/note";
import { nextServer } from "./api";
import { api } from "@/app/api/api";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequest): Promise<User> => {
  const res = await nextServer.post("/auth/login", data);
  return res.data;
};

export const register = async (data: RegisterRequest): Promise<User> => {
  const res = await nextServer.post("/auth/register", data);
  return res.data;
};

export const logout = async () => {
  await api.post("/auth/logout"); 
  localStorage.removeItem("token");
};
export const getMe = async (): Promise<User> => {
  const res = await nextServer.get("/users/me");
  return res.data;
};

/* -------- UPDATE USER (PROFILE) -------- */

export type UpdateUserRequest = {
  username?: string;
  avatar?: string;
};

export const updateMe = async (payload: UpdateUserRequest): Promise<User> => {
  const res = await nextServer.patch<User>("/users/me", payload);
  return res.data;
};

/* -------- NOTES (опционально) -------- */

export type FetchNotesParams = {
  query?: string;
  tag?: string;
  page?: number;
  perPage?: number;
};

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<{ notes: Note[]; totalPages: number }> => {
  const res = await nextServer.get<{ notes: Note[]; totalPages: number }>("/notes", {
    params: {
      search: params.query || undefined,
      tag: params.tag || undefined,
      page: params.page || 1,
      perPage: params.perPage || 12,
    },
  });

  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await nextServer.get<Note>(`/notes/${id}`);
  return res.data;
};

export const createNote = async (newNoteData: NewNoteData) => {
  const res = await nextServer.post<Note>("/notes", newNoteData);
  return res.data;
};

export const deleteNote = async (id: string) => {
  const res = await nextServer.delete<Note>(`/notes/${id}`);
  return res.data;
};
