// lib/api/clientApi.ts
"use client";

import { nextServer } from "./api";
import type { User } from "@/types/user";
import type { Note, NewNoteData } from "@/types/note";
import { ApiError } from "@/app/api/api";

// --- Подставляем Bearer из localStorage ---
nextServer.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== AUTH ==========

export type RegisterRequest = {
  email: string;
  password: string;
  username: string;
};

export async function register(request: RegisterRequest): Promise<User> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, headers } = await nextServer.post<{ user: User; token: string }>(
    "/auth/register",
    request,
    { withCredentials: true }
  );

  if (data.token) localStorage.setItem("accessToken", data.token);

  return data.user;
}

export type LoginRequest = {
  email: string;
  password: string;
};

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

export type UpdateUserPayload = { username?: string; avatar?: string };

export async function updateMe(payload: UpdateUserPayload) {
  const { data } = await nextServer.patch("/users/me", payload);
  return data;
}

// ========== UPLOAD ==========
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await nextServer.post<{ url: string }>("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

  return data.url;
}

// ========== NOTES ==========
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

// ========== ERROR UTILS ==========
export function extractApiError(error: unknown): string {
  const err = error as ApiError;
  return (
    err?.response?.data?.error ??
    err?.message ??
    "Oops... something went wrong"
  );
}
