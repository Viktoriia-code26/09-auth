// lib/api/clientApi.ts
"use client";

import { nextServer } from "./api";
import type { User } from "@/types/user";
import type { Note, NewNoteData } from "@/types/note";




export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export const login = async (data: LoginRequest): Promise<User> => {
  const res = await nextServer.post<LoginResponse>("/auth/login", data);

  if (!res.data?.token || !res.data?.user) {
    throw new Error("Invalid login response");
  }


  localStorage.setItem("token", res.data.token);
  document.cookie = `token=${res.data.token}; path=/; SameSite=Lax`;

  return res.data.user;
};



export type RegisterRequest = {
  email: string;
  password: string;
};

export const register = async (data: RegisterRequest): Promise<User> => {
  const res = await nextServer.post<LoginResponse>("/auth/register", data);

  if (!res.data?.token || !res.data?.user) {
    throw new Error("Invalid registration response");
  }

  localStorage.setItem("token", res.data.token);
  document.cookie = `token=${res.data.token}; path=/; SameSite=Lax`;

  return res.data.user;
};



export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
  localStorage.removeItem("token");
  document.cookie = "token=; Max-Age=0; path=/; SameSite=Lax";
};


export const getMe = async (): Promise<User | null> => {
  try {
    const res = await nextServer.get<User>("/users/me");
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};


export type UpdateUserRequest = {
  username?: string;
  avatar?: string;
};

export const updateMe = async (payload: UpdateUserRequest): Promise<User> => {
  const res = await nextServer.patch<User>("/users/me", payload);
  return res.data;
};


export const checkSession = async () => {
  const res = await nextServer.get("/auth/session");
  return res.data;
};


export type FetchNotesParams = {
  query?: string;
  tag?: string;
  page?: number;
  perPage?: number;
  currentPage?: number;
};

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<{ notes: Note[]; totalPages: number }> => {
  const res = await nextServer.get<{ notes: Note[]; totalPages: number }>(
    "/notes",
    {
      params: {
        search: params.query || undefined,
        tag: params.tag || undefined,
        page: params.page || 1,
        perPage: params.perPage || 12,
      },
    }
  );

  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await nextServer.get<Note>(`/notes/${id}`);
  return res.data;
};

export const createNote = async (newNoteData: NewNoteData): Promise<Note> => {
  const res = await nextServer.post<Note>("/notes", newNoteData);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await nextServer.delete<Note>(`/notes/${id}`);
  return res.data;
};
