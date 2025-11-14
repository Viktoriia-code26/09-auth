import axios, { AxiosError } from "axios";

export const nextServer = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
export type ApiError = AxiosError<{ error: string }>