// //--app/api//

import axios, { AxiosError } from "axios";

const BASE_URL = 'https://notehub-api.goit.study';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export type ApiError = AxiosError<{ error: string }>;