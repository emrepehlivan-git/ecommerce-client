import axios, { AxiosRequestConfig } from "axios";

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const axiosClientMutator = (config: AxiosRequestConfig) =>
  axiosClient(config);
