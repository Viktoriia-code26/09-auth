"use client";

import { ApiError, nextServer } from "./api";
import type { User } from "@/types/user";
import type { Note, NewNoteData } from "@/types/note";


nextServer.interceptors.request.use((config) => {
  return config;
});

export type RegisterRequest = {
  email: string;
  password: string;
  username: string;
};

export async function register(request: RegisterRequest): Promise<User> {
  const { data } = await nextServer.post<{ user: User; token: string }>(
    "/auth/register",
    request,
    { withCredentials: true }
  );

  if (data.token) localStorage.setItem("accessToken", data.token);

  return data.user;
}
export type LoginRequest = { email: string; password: string; };

export async function login(email: string, password: string): Promise<User> {
  const { data } = await nextServer.post<{ user: User; token: string }>(
    "/auth/login",
    { email, password },
    { withCredentials: true }
  );

  if (data.token) localStorage.setItem("accessToken", data.token);

  return data.user;
}

export async function logout(): Promise<void> {
  try {
    await nextServer.post("/auth/logout", {}, { withCredentials: true });
  } catch {}

  localStorage.removeItem("accessToken");
}

export async function checkSession(cookieHeader?: string) {
  try {
    return await nextServer.get("/auth/session", {
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
      withCredentials: true,
    });
  } catch {
    return null;
  }
}

export async function getMe(): Promise<User | null> {
  try {
    const { data } = await nextServer.get<User>("/users/me");
    return data;
  } catch {
    return null;
  }
}

export type UpdateUserPayload = {
  username?: string;
};

export async function updateMe(payload: UpdateUserPayload): Promise<User> {
  const { data } = await nextServer.patch<User>("/users/me", payload);
  return data;
}

export async function fetchNotes(params: {
  query?: string;
  tag?: string;
  page?: number;
  perPage?: number;
}): Promise<{ notes: Note[]; totalPages: number }> {
  const res = await nextServer.get("/notes", {
    params: {
      search: params.query,
      tag: params.tag,
      page: params.page ?? 1,
      perPage: params.perPage ?? 12,
    },
  });

  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await nextServer.get(`/notes/${id}`);
  return data;
}

export async function createNote(newNoteData: NewNoteData): Promise<Note> {
  const { data } = await nextServer.post("/notes", newNoteData);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await nextServer.delete(`/notes/${id}`);
  return data;
}

export function extractApiError(error: unknown): string {
  const err = error as ApiError;
  return (
    err?.response?.data?.error ??
    err?.message ??
    "Oops... something went wrong"
  );
}
