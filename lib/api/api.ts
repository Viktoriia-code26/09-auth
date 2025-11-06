// lib/api/api.ts
import axios, { AxiosError, AxiosInstance } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

export const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true, // підтримка cookies
});

export type ApiError = AxiosError<{ error: string; message?: string }>;