import {
  DefaultError,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosRequestConfig, AxiosResponse } from "axios";

export interface Err extends AxiosResponse<DefaultError> {
}

export interface ValidationError {
  [key: string]: string; // Example: { "newPassword": "new password must be different from old password" }
}

export interface ExtendedErrorData extends DefaultError {
  status?: number;
  message: string;
  validation?: ValidationError;
  [key: string]: any;
}

export interface ExtendedError extends AxiosResponse {
  data: ExtendedErrorData;
}

export interface ServiceMutationConfig<Res = unknown, Var = unknown> {
  axios?: AxiosRequestConfig;
  query?: UseMutationOptions<Res, Err, Var>;
}

export interface ServiceConfig<Res = unknown> {
  axios?: AxiosRequestConfig;
  query?: UseQueryOptions<Res, Err>;
}

export const API = {
  AUTH: {
    LOGIN: `/agent/auth/login`,
    GET_ME: `/agent/auth/me`,
  },
  DASHBOARD: {
    DASHBOARD: `/agent/dashboard`,
    TOTAL_TICKET: `/agent/dashboard/total-ticket`,
    TOTAL_TICKET_NOW: `/agent/dashboard/total-ticket-now`,
  },
  TICKET: {
    COMMENT: {
      CREATE: `/agent/ticket/comments/add`,
      DETAIL: (id: string) => `/agent/ticket/comments/detail/${id}`,
      LIST: (id: string) => `/agent/ticket/comments/list/${id}`,
    },
    EXPORT: `/agent/ticket/export-csv`,
    TIME_LOG: {
      LIST: `/agent/timelogs/list`,
    },
    LIST: `/agent/ticket/list`,
    TASK_LIST: `/agent/ticket/mine/list`,
    ADD_TO_MY_TASK: (id: string) => `/agent/ticket/assign-me/${id}`, 
    DETAIL: (id: string) => `/agent/ticket/detail/${id}`,
    CLOSE: `/agent/ticket/close`,
    REOPEN: `/agent/ticket/reopen`,
    START_LOG: `/agent/ticket/logging/start`,
    RESUME_LOG: `/agent/ticket/logging/resume`,
    PAUSE_LOG: () => `/agent/ticket/logging/pause`,
    STOP_LOG: () => `/agent/ticket/logging/stop`,
    UPLOAD_ATTACHMENT: `/agent/attachment/upload`,
    UPDATE_TIME_TRACK: (id: string) => `/agent/ticket/time-track/update/${id}`,
    EXPORT_CSV: `/agent/ticket/export-csv`,
    ASSIGN_TO_ME: (id: string) => `/agent/ticket/assign-me/${id}`,
  },
  ATTACHMENT: {
    UPLOAD: `/agent/attachment/upload`,
    DETAIL: (id: string) => `/agent/attachment/detail/${id}`,
  },
  CUSTOMER: {
    // COMPANY PRODUCT is customer b2b
    CREATE: `/agent/company-product/create`,
    LIST: `/agent/company-product/list`,
    DETAIL: (id: string) => `/agent/company-product/detail/${id}`,
    UPDATE: (id: string) => `/agent/company-product/update/${id}`,
    UPLOAD: `/agent/company-product/upload-logo`,
    DELETE: (id: string) => `agent/company-product/delete/${id}`,
    //CUSTOMER USER is customer user
    LIST_CUSTOMER_USER: `/agent/customer/list`,
    DETAIL_CUSTOMER_USER: (id: string) => `/agent/customer/detail/${id}`,
  },
  USER: {
    LIST: "/agent/user/list",
    CREATE: "/agent/user/create",
    DETAIL: (id: string) => `/agent/user/detail/${id}`,
    UPDATE: (id: string) => `/agent/user/update/${id}`,
    DELETE: (id: string) => `/agent/user/delete/${id}`,
  },
  COMPANY: {
    DETAIL: `/agent/company/detail`,
  },
  SETTING: {
    UPDATE_PROFILE: `/agent/setting/update-profile`,
    UPLOAD_PROFILE: `agent/setting/upload-profile-picture`,
    UPDATE_DOMAIN: `/agent/setting/change-domain`,
    UPDATE_PASSWORD: `/agent/setting/change-password`,
    CONFIG: `/agent/config`,
  },
  CATEGORY: {
    LIST: `/agent/ticket-category/list`,
    CREATE: `/agent/ticket-category/create`,
    DETAIL: (id: string) => `/agent/ticket-category/detail/${id}`,
    UPDATE: (id: string) => `/agent/ticket-category/update/${id}`,
    DELETE: (id: string) => `/agent/ticket-category/delete/${id}`,
  },
};
