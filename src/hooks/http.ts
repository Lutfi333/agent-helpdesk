"use client";
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import {
  type UseQueryOptions,
  type UseMutationOptions,
  useQuery,
  useMutation,
  UndefinedInitialDataOptions,
} from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { AUTH_KEY } from "@/constants/auth";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

http.interceptors.request.use((config) => {
  const token = Cookies.get(AUTH_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If the error is not 401, just reject as-is & check if the error response and add notification
    if (error?.response?.status === 403) {
      toast.error("Forbidden: You don't have permission to access this resource");
      Cookies.remove(AUTH_KEY);

      setTimeout(() => {
        window.location.href = "/login";
      }, 200);
    } else if (error?.response?.status !== 401) {
      // window.message.error(message)
      return Promise.reject(error);
    } else {
      toast.error("Sesi Anda telah habis. Silakan login kembali");
      Cookies.remove(AUTH_KEY);

      setTimeout(() => {
        window.location.href = "/login";
      }, 200);
    }
  },
);

type Config<TData = any, TError = DefaultError> = {
  method?: "GET" | "HEAD" | "POST" | "OPTIONS" | "PUT" | "DELETE" | "PATCH";
  keys?: any[];
  params?: Record<string, any>;
  httpOptions?: AxiosRequestConfig;
  queryOptions?: UseQueryOptions<TData, TError>;
};

type DefaultError = {
  message: string;
  validation: {};
};

/**
* API GET Method request only.
* @example
    const { data: items, isLoading, isError } = useHttp<number, string>('/', {
      keys: ['id']
      queryOptions: {
        onSuccess: function (data) {
          return
        },
        onError: function (data) {
          data
        },
      },
    })
* @param url URL API
* @param options HTTP Mutation Options
*/
export function useHttp<TData = any, TError = any>(
  url: string,
  options?: Config<TData, TError>,
) {
  const defaultOptions: UndefinedInitialDataOptions<TData, TError> = {
    queryKey: [url, options],
    queryFn: async () => {
      try {
        const defaultConfig = {
          url,
        };

        if (options?.httpOptions) {
          Object.assign(defaultConfig, options.httpOptions);
        }

        if (options?.method) {
          Object.assign(defaultConfig, { method: options.method });
        } else {
          Object.assign(defaultConfig, { method: "GET" });
        }

        if (options?.params) {
          Object.assign(defaultConfig, { params: options.params });
        }
        const { data } = await http.request<TData>(defaultConfig);
        return data ?? null;
      } catch (e: any) {
        Promise.reject(e?.response ?? e);
        return e;
      }
    },
  };

  if (options?.queryOptions) {
    Object.assign(defaultOptions, options.queryOptions);
  }
  return useQuery(defaultOptions);
}

type HttpMutationOptions<
  TData = any,
  TError = any,
  TVariables = any,
  TContext = any,
> = {
  method: "GET" | "HEAD" | "POST" | "OPTIONS" | "PUT" | "DELETE" | "PATCH";
  params?: Record<string, any>;
  httpOptions?: AxiosRequestConfig;
  queryOptions?: UseMutationOptions<TData, TError, TVariables, TContext>;
};

/**
* Update data to the server.
* @example
  const {mutate, isLoading, isError, error} =  useHttpMutation<TData, TError>('todos/:id', {
    method: 'POST',
    httpOptions: { // axios options
      timeout: 30000,
    },
    queryOptions: { // vue-query options
      onSuccess: function (data) {
        console.log(data);
      },
      onError: function (data) {
        console.log(data);
      },
    },
    })
    const onSubmitForm = (data) => {
      mutate(data)
    }
* @param url URL API
* @param options HTTP Mutation Options
*/
export function useHttpMutation<
  TData = any,
  TError = AxiosResponse<DefaultError>,
  TVariables = any,
>(url: string, options: HttpMutationOptions<TData, TError>) {
  return useMutation({
    mutationFn: (value: TVariables) => {
      return new Promise<TData>((resolve, reject) => {
        return http
          .request<TData>({
            url: url,
            method: options.method,
            params: options.params,
            ...options.httpOptions,
            data: value,
          })
          .then((response) => {
            resolve(response.data);
          })
          .catch((error: AxiosError<TError>) => {
            reject(error.response ?? error.message);
          });
      });
    },
    ...options.queryOptions,
  });
}
