// lib/api/api.ts
import axios, { AxiosInstance } from "axios";

export const createApi = (cookieHeader?: string): AxiosInstance => {
  const baseURL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api`;

  const instance = axios.create({
    baseURL,
    withCredentials: true, 
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("Axios error:", error?.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  return instance;
};

export { createApi as api };
