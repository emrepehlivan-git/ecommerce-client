import axios, { AxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";
import { auth } from "./auth";
import { signOut } from "next-auth/react";

const getBaseURL = () => {
  if (typeof window === "undefined") {
    return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;
  }
  return process.env.NEXT_PUBLIC_API_URL;
};

const axiosClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000, 
  maxRedirects: 3,
  maxContentLength: 2000000,
  maxBodyLength: 2000000,
});

axiosClient.defaults.timeout = 10000;

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

axiosClient.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error?.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const session = await getSession();

        if (session?.error === "RefreshAccessTokenError") {
          processQueue(error, null);
          if (typeof window !== "undefined") {
            window.location.href = "/session-expired";
          }
          return Promise.reject(error);
        }

        if (session?.accessToken) {
          originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;
          processQueue(null, session.accessToken);
          return axiosClient(originalRequest);
        } else {
          processQueue(error, null);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const axiosClientMutator = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const headers = config.headers || {};
  if (typeof window === "undefined") {
    const session = await auth();
    if (session?.accessToken) {
      headers["Authorization"] = `Bearer ${session.accessToken}`;
    }
  }

  if (config.data instanceof FormData) {
    headers["Content-Type"] = "multipart/form-data";
  }

  return axiosClient({ ...config, headers }).then((res) => res.data);
};

