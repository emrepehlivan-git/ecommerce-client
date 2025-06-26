import axios, { AxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

const getBaseURL = () => {
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;
  }
  return process.env.NEXT_PUBLIC_API_URL;
};

export const axiosClient = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
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
  (error) => {
    return Promise.reject(error);
  }
);

export const axiosClientMutator = (config: AxiosRequestConfig) =>
  axiosClient(config);
