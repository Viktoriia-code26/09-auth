import axios, { AxiosInstance } from "axios";
import { cookies } from "next/headers";

export const createServerApi = async (): Promise<AxiosInstance> => {
  const cookieStore = await cookies();
  const cookieToken =
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("token")?.value ||      
    null;

  const baseURL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

  const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      ...(cookieToken ? { Authorization: `Bearer ${cookieToken}` } : {}),
    },
  });

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      const status = err?.response?.status;
      if (status !== 401) {
        console.error("Server Axios error:", err?.response?.data || err.message);
      }
      return Promise.reject(err);
    }
  );

  return instance;
};
