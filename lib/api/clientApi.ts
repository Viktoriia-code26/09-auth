import axios, { AxiosInstance } from "axios";
import type { User } from "@/types/user";
import type { Note, NewNoteData } from "@/types/note";

/* ---------- TYPES ---------- */
export type RegisterRequest = {
  email: string;
  password: string;
  username?: string; // 👈 необязательное поле
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

/* ---------- CREATE AXIOS INSTANCE ---------- */
export const clientApi: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/* ---------- REQUEST INTERCEPTOR ---------- */
clientApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ---------- RESPONSE INTERCEPTOR ---------- */
clientApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn("Unauthorized – пропускаем /api/users/me");
      return Promise.resolve({ data: null });
    }
    return Promise.reject(err);
  }
);

/* ---------- AUTH ---------- */
export const register = async (data: RegisterRequest): Promise<User> => {
  const res = await clientApi.post<User>("/auth/register", data);
  return res.data;
};

export const login = async (data: LoginRequest): Promise<User> => {
  try {
    const res = await clientApi.post<LoginResponse>("/auth/login", data);
    const token = res.data?.token;

    if (token) {
      localStorage.setItem("token", token);
      document.cookie = `accessToken=${token}; path=/; SameSite=Lax`;
      document.cookie = `token=${token}; path=/; SameSite=Lax`;
    }

    return res.data.user;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;

      if (status === 401) {
        throw new Error("Неверный email или пароль");
      }

      throw new Error(
        err.response?.data?.message || "Ошибка при авторизации"
      );
    }

    throw new Error("Непредвиденная ошибка");
  }
};

export const logout = async () => {
  await clientApi.post("/auth/logout");
  localStorage.removeItem("token"); 
};

export const checkSession = async (): Promise<boolean> => {
  try {
    const res = await clientApi.get("/auth/session");
    return res.status === 200;
  } catch {
    return false;
  }
};

export const getMe = async (): Promise<User | null> => {
  try {
    const { data } = await clientApi.get<User>("/users/me");
    return data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      return null;
    }
    console.error("getMe error:", err);
    return null;
  }
};

/* ---------- USER ---------- */
export const updateMe = async (payload: FormData | Partial<User>) => {
  const res = await clientApi.patch<User>("/users/me", payload, {
    headers:
      payload instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" },
  });
  return res.data;
};

/* ---------- NOTES ---------- */
export const fetchNotes = async (params: {
  query?: string;
  tag?: string;
  currentPage?: number;
  perPage?: number;
}) => {
  const { data } = await clientApi.get<{ notes: Note[]; totalPages: number }>(
    "/notes",
    { params }
  );
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
