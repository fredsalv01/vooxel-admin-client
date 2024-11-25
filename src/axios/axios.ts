import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { store } from "../store";
import { addToken } from "../features/tokenReducer";
import { redirect } from "react-router-dom";

interface ImportMetaEnv {
  VITE_API_BACK_LOCAL: string;
  VITE_API_BACK_DEV: string;
  VITE_API_BACK_PROD: string
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BACK_DEV || import.meta.env.VITE_API_BACK_LOCAL,
  // timeout: 10000, // 10s.
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().tokens; // Obtener el token del store
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response) {
      switch (error.response.status) {
        case 403:
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            const { data } = await axiosInstance.post("/auth/refresh", {
              token: store.getState().tokens,
            });
            store.dispatch(addToken(data.token));
            return axiosInstance(originalRequest);
          }
          break;
        case 401:
          redirect("/login");
          break;
        case 404:
          console.error("Requested resource not found");
          break;
        default:
          const errorMessage = (error.response.data as { message: string }).message;
          console.error(errorMessage);
      }
    } else if (error.request) {
      console.error("Request was made but no response was received");
    } else {
      console.error("Something happened in setting up the request");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
