/* eslint-disable @typescript-eslint/no-unused-vars */
// lib/api/clientApi.ts
"use client";

import { api, ApiError } from "./api";
import type { User } from "@/types/user";
import type { Note, NewNoteData } from "@/types/note";

// Добавляем токен к запросам
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== AUTH ==========

export async function register(email: string, password: string): Promise<User> {
  const { data } = await api.post<{ user: User; token: string }>(
    "/auth/register",
    { email, password }
  );
  localStorage.setItem("token", data.token);
  document.cookie = `token=${data.token}; Path=/; SameSite=Lax`;
  return data.user;
}

export async function login(email: string, password: string): Promise<User> {
  const { data } = await api.post<{ user: User; token: string }>(
    "/auth/login",
    { email, password }
  );
  localStorage.setItem("token", data.token);
  document.cookie = `token=${data.token}; Path=/; SameSite=Lax`;
  return data.user;
}

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout", {}); 
  } catch (_) {}

  localStorage.removeItem("token");
  document.cookie = "token=; Max-Age=0; Path=/";
}

export async function checkSession() {
  try {
    const { data } = await api.get("/auth/session");
    return data;
  } catch {
    return null;
  }
}

export async function getMe(): Promise<User | null> {
  try {
    const { data } = await api.get<User>("/users/me");
    return data;
  } catch {
    return null;
  }
}

export async function updateMe(payload: { username?: string; avatar?: string }) {
  const { data } = await api.patch("/users/me", payload ?? {});
  return data;
}

// ========== UPLOAD IMAGE ==========

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await api.post<{ url: string }>("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
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
  const res = await api.get("/notes", {
    params: {
      search: params.query,
      tag: params.tag,
      page: params.page,
      perPage: params.perPage ?? 12,
    },
  });

  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await api.get(`/notes/${id}`);
  return res.data;
}

export async function createNote(newNoteData: NewNoteData): Promise<Note> {
  const res = await api.post("/notes", newNoteData);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await api.delete(`/notes/${id}`);
  return res.data;
}

// Unified error extraction
export function extractApiError(error: unknown): string {
  const err = error as ApiError;
  return (
    err?.response?.data?.error ??
    err?.message ??
    "Oops... something went wrong"
  );
}
