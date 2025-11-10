import axios, { AxiosInstance } from "axios";
import { cookies } from "next/headers";

export const createServerApi = async (): Promise<AxiosInstance> => {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("token")?.value ||
    null;

  if (!token) {
    console.warn("⚠️ No valid token (SSR) — skipping request");
  }

  const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        console.warn("🔒 Unauthorized (SSR) — handled gracefully");
        return Promise.resolve({ data: null });
      }
      console.error("❌ Server Axios error:", {
        status: err.response?.status,
        message: err.message,
      });
      return Promise.reject(err);
    }
  );

  return instance;
};
