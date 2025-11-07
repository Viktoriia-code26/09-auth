// lib/api/clientApi.ts
import { api, createApi } from "./api";
import { User } from "@/types/user";
import { Note, NewNoteData } from "@/types/note";
import { AxiosError } from "axios";

const clientApi = createApi();

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
  const { data } = await clientApi.get<{ notes: Note[]; totalPages: number }>("/notes", {
    params: { search: query || undefined, tag: tag || undefined, page: currentPage, perPage },
  });
  return data;
};

export const fetchNoteById = async (id: string) => {
  const { data } = await clientApi.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (newNoteData: NewNoteData) => {
  const { data } = await clientApi.post<Note>("/notes", newNoteData);
  return data;
};

export const deleteNote = async (id: string) => {
  const { data } = await clientApi.delete<Note>(`/notes/${id}`);
  return data;
};

// --- Auth --- //
export type RegisterRequest = {
  email: string;
  password: string;
  userName?: string; 
};
export const register = async (data: RegisterRequest) => {
  const { email, password } = data;
  try {
    const client = await api();
    const res = await client.post("/auth/register", { email, password });
    console.log("User registered:", res.data);
  } catch (err: unknown) {
    if (err instanceof AxiosError && err.response?.status === 409) {
      alert("This email is already registered. Please sign in instead.");
    } else {
      alert("Registration failed. Please try again later.");
      console.error("Registration error:", err);
    }
  }
}

export type LoginRequest = { email: string; password: string };
export const login = async (data: LoginRequest) => {
  const res = await clientApi.post<User>("/auth/login", data);
  return res.data;
};

export const logout = async () => {
  await clientApi.post("/auth/logout");
};

export const checkSession = async () => {
  const res = await clientApi.get<{ isAuthenticated: boolean }>("/auth/session");
  return res.data.isAuthenticated;
};

export const getMe = async (): Promise<User | null> => {
  try {
    const { data } = await clientApi.get<User>("/users/me");
    return data;
  } catch (err) {
    console.error("getMe error:", err);
    return null;
  }
};

export const updateMe = async (payload: Partial<User>) => {
  const { data } = await clientApi.patch<User>("/users/me", payload);
  return data;
};
