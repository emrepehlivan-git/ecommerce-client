import axios, { AxiosRequestConfig } from "axios";

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

export const axiosClientMutator = (config: AxiosRequestConfig) =>
  axiosClient(config);
