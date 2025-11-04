import { User } from "@/types/user";
import { nextServer } from "./api"
import { NewNoteData, Note } from "@/types/note";

export interface ApiNoteResponse {
  content: string;
  title: string;
  notes: Note[];
  totalPages: number;
  totalResults?: number;
}
export type UpdateUserRequest = {
  userName?: string;
  photoUrl?: string;
};
export type RegisterRequest = {
  email: string;
  password: string;
  userName: string;
};

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN
const BASE_URL = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN + '/api';

export async function fetchNotes({
  query = "",
  tag,
  currentPage = 1,
  perPage = 12,
}: {
  query?: string;
  tag?: string;
  currentPage?: number;
  perPage?: number;
}): Promise<ApiNoteResponse> {
  const response = await nextServer.get<ApiNoteResponse>(BASE_URL, {
    params: {
      search: query || undefined,
      tag: tag || undefined,
      page: currentPage,
      perPage,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Cache-Control": "no-cache",
    },
  });
  return response.data;
}

export async function createNote(newNoteData: NewNoteData): Promise<Note> {
  const response = await nextServer.post<Note>(BASE_URL, newNoteData, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await nextServer.delete<Note>(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
    const response = await nextServer.get<Note>(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return response.data;
}

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>('/auth/register', data);
  return res.data;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>('/auth/login', data);
  return res.data;
};

type CheckSessionRequest = {
  success: boolean;
};

export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>('/auth/session');
  return res.data.success;
};
export const getMe = async () => {
  const { data } = await nextServer.get<User>('/auth/me');
  return data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout')
};
export const updateMe = async (payload: UpdateUserRequest) => {
  const res = await nextServer.put<User>('/auth/me', payload);
  return res.data;
};
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await nextServer.post('/upload', formData);
  return data.url;
};