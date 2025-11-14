import axios, { AxiosError, AxiosInstance } from 'axios';

const BASE_URL = 'https://notehub-api.goit.study';

// Клиентский Axios (браузер)
export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export type ApiError = AxiosError<{ error: string }>