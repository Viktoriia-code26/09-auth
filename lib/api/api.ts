// lib/api.ts

import axios, { AxiosError } from 'axios';

export const nextServer = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, 
});

export type ApiError = AxiosError<{ error: string }>