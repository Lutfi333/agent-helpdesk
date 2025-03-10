"use client";
import { API, Err, ServiceConfig, ServiceMutationConfig } from "..";
import {
  PayloadCustomerList,
  ResponseListCustomer,
} from "./customer.list.types";
import {
  ResponseDetailCustomer,
  ResponseDetailCustomerUser,
} from "./customer.detail.types";
import { CustomerCreatePayload } from "./customer.types";
import { ResponseUploadLogo } from "./upload.logo.types";
import { ResponseUpdateCustomer } from "./update.customer.types";
import { R } from "@/types/response";
import { ResponseCustomerUser } from "./customer-user.types";

export const useCreateCustomer = <Res = ResponseListCustomer>(
  config?: ServiceMutationConfig<Res, CustomerCreatePayload>,
) =>
  useHttpMutation<Res, Err, CustomerCreatePayload>(API.CUSTOMER.CREATE, {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useCustomerList = <Res = ResponseListCustomer>(
  paginate: PayloadCustomerList,
  config?: ServiceConfig<Res>,
) =>
  useHttp<Res>(API.CUSTOMER.LIST, {
    method: "GET",
    httpOptions: config?.axios,
    params: { ...paginate },
  });
  
export const useCustomerDetail = <Res = ResponseDetailCustomer>(id: string) =>
  useHttp<Res>(API.CUSTOMER.DETAIL(id));

export const useCustomerUserList = <Res = ResponseCustomerUser>(
  paginate: PayloadCustomerList,
  config?: ServiceConfig<Res>,
) =>
  useHttp<Res>(API.CUSTOMER.LIST_CUSTOMER_USER, {
    httpOptions: config?.axios,
    params: { ...paginate },
  });

export const useCustomerUserDetail = <Res = ResponseDetailCustomerUser>(
  id: string,
) => useHttp<Res>(API.CUSTOMER.DETAIL_CUSTOMER_USER(id));

export const useCustomerDetailMutation = <Res = ResponseDetailCustomerUser>(
  id: string,
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res>(API.CUSTOMER.DETAIL_CUSTOMER_USER(id), {
    method: "GET",
    httpOptions: config?.axios,
  });

export const useUploadLogo = <Res = ResponseUploadLogo>(
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.CUSTOMER.UPLOAD, {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useUpdateCustomer = <Res = ResponseUpdateCustomer>(
  id: string,
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.CUSTOMER.UPDATE(id), {
    method: "PUT",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useDeleteCustomer = <Res = R<any>>(
  id?: string,
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.CUSTOMER.DELETE(id ?? ""), {
    method: "DELETE",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });
