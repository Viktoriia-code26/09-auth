// lib/api/serverApi.ts
import axios from "axios";
import { cookies } from "next/headers";
import { Note } from "@/types/note";
import { User } from "@/types/user";
import { api } from "./api"
import { getCookie, setCookie } from "cookies-next";

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
export const getServerMe = async () => {
  const serverApi = await getServerApi();
  const { data } = await serverApi.get<User>("/users/me");
  return data;
};

// interface CheckSessionResponse {
//   success?: boolean;
//   user?: {
//     id: string;
//     email: string;
//     name?: string;
//   };
// }

// (для middleware)
export const checkSession = async () => {
  const refreshToken = getCookie("refreshToken");
  if (!refreshToken) return null;

  try {
    const res = await api.post("/auth/session", { refreshToken }, { withCredentials: true });
    const setCookieHeader = res.headers["set-cookie"];
    if (setCookieHeader) {
      const cookiesArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
      cookiesArray.forEach((cookieStr) => {
        const [nameValue] = cookieStr.split(";"); 
        const [name, value] = nameValue.split("=");
        if (name && value) {
          setCookie(name.trim(), value.trim(), { path: "/", httpOnly: false });
        }
      });
    }

    return res.data;
  } catch (err) {
    console.error("Session refresh failed:", err);
    return null;
  }
};