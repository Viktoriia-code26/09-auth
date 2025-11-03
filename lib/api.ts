import axios from "axios";
import type { Note, NewNoteData } from "../types/note";

export interface ApiNoteResponse {
  content: string;
  title: string;
  notes: Note[];
  totalPages: number;
  totalResults?: number;
}

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const BASE_URL = "https://notehub-public.goit.study/api/notes";

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
  const response = await axios.get<ApiNoteResponse>(BASE_URL, {
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
  const response = await axios.post<Note>(BASE_URL, newNoteData, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await axios.delete<Note>(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  try {
    const response = await axios.get<Note>(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(`Note with ID ${id} not found`);
    }
    throw error;
  }
}
