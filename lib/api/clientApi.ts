/* eslint-disable @typescript-eslint/no-unused-vars */
// lib/api/clientApi.ts
"use client";

import { nextServer } from "./api";
import type { User } from "@/types/user";
import type { Note, NewNoteData } from "@/types/note";
import { ApiError } from "@/app/api/api";


nextServer.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== AUTH ==========
export type RegisterRequest = {
  email: string;
  password: string;
  userName: string;
};
export async function register(email: string, password: string): Promise<User> {
  const { data } = await nextServer.post<{ user: User; token: string }>(
    "/auth/register",
    { email, password }
  );
  localStorage.setItem("token", data.token);
  document.cookie = `token=${data.token}; Path=/; SameSite=Lax`;
  return data.user;
}
export type LoginRequest = {
  email: string;
  password: string;
};

export async function login(email: string, password: string): Promise<User> {
  const { data } = await nextServer.post<{ user: User; token: string }>(
    "/auth/login",
    { email, password }
  );
  localStorage.setItem("token", data.token);
  document.cookie = `token=${data.token}; Path=/; SameSite=Lax`;
  return data.user;
}

export async function logout(): Promise<void> {
  try {
    await nextServer.post("/auth/logout"); 
  } catch (_) {}

  localStorage.removeItem("token");
  document.cookie = "token=; Max-Age=0; Path=/";
}
export async function checkSession() {
  try {
    const { data } = await nextServer.get("/auth/session");
    return data;
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

export async function updateMe(payload: { username?: string; avatar?: string }) {
  const { data } = await nextServer.patch("/users/me", payload ?? {});
  return data;
}

// ========== UPLOAD IMAGE ==========

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await nextServer.post<{ url: string }>("/upload", formData, {
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
  const res = await nextServer.get("/notes", {
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
  const res = await nextServer.get(`/notes/${id}`);
  return res.data;
}

export async function createNote(newNoteData: NewNoteData): Promise<Note> {
  const res = await nextServer.post("/notes", newNoteData);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await nextServer.delete(`/notes/${id}`);
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
