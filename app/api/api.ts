

import axios, { AxiosError, AxiosInstance } from 'axios';

const BASE_URL = 'https://notehub-api.goit.study';

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});


export type ApiError = AxiosError<{ error: string }>