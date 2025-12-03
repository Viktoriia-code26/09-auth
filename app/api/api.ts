import axios, { AxiosError, AxiosInstance } from 'axios';

export const api: AxiosInstance = axios.create({
  baseURL: 'https://notehub-api.goit.study',
  withCredentials: true,
});

export type ApiError = AxiosError<{ error: string }>;
