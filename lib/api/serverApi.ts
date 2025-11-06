// lib/api/serverApi.ts
import axios from "axios";
import { cookies } from "next/headers";
import { Note } from "@/types/note";
import { User } from "@/types/user";
import {api} from "./api"

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

// Функція для створення серверного інстансу з куками
async function getServerApi() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      Cookie: cookieHeader,
    },
  });
}

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
  const serverApi = await getServerApi();
  const { data } = await serverApi.get<{ notes: Note[]; totalPages: number }>("/notes", {
    params: {
      search: query || undefined,
      tag: tag || undefined,
      page: currentPage,
      perPage,
    },
  });
  return data;
};

export const fetchNoteById = async (id: string) => {
  const serverApi = await getServerApi();
  const { data } = await serverApi.get<Note>(`/notes/${id}`);
  return data;
};

// --- Auth --- //
export const getMe = async () => {
  const serverApi = await getServerApi();
  const { data } = await serverApi.get<User>("/users/me");
  return data;
};

interface CheckSessionResponse {
  success?: boolean;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

// 🔹 Оновлення сесії (для middleware)
export async function checkSession() {
  try {
    const cookieStore = await cookies();

    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const res = await api.get<CheckSessionResponse>("/auth/session", {
      headers: { Cookie: cookieHeader },
    });

    // 👇 вот тут меняем тип
    return {
      data: res.data,
      headers: res.headers as Record<string, string | string[]>,
    };
  } catch (err) {
    console.error("checkSession error:", err);
    return { data: null, headers: {} as Record<string, string | string[]> };
  }
}