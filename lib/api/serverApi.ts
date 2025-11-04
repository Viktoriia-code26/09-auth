// lib/api/serverApi.ts

import { User } from '@/types/user';
import { Note } from '@/types/note';
import { nextServer } from './api';
import { cookies } from 'next/headers';

export const checkServerSession = async () => {
  // Дістаємо поточні cookie
  const cookieStore = await cookies();
  const res = await nextServer.get('/auth/session', {
    headers: {
      // передаємо кукі далі
      Cookie: cookieStore.toString(),
    },
  });
  // Повертаємо повний респонс, щоб middleware мав доступ до нових cookie
  return res;
};
export const getServerMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get('/auth/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};


export interface ApiNoteResponse {
  content: string;
  title: string;
  notes: Note[];
  totalPages: number;
  totalResults?: number;
}

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


export async function fetchNoteById(id: string): Promise<Note> {
    const response = await nextServer.get<Note>(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return response.data;

  }
