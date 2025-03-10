import { PaginationParams } from "@/types/payload";
import { API, Err, ServiceConfig, ServiceMutationConfig } from "..";
import { UserDetailResponse, UserListResponse } from "./types";
import { R } from "@/types/response";

export const useUserList = <Res = UserListResponse>(params: PaginationParams) =>
  useHttp<Res>(API.USER.LIST, { params: params });

export const useDetailUser = <Res = UserDetailResponse>(
  id?: string,
  config?: ServiceConfig,
) =>
  useHttp<Res>(API.USER.DETAIL(id ?? ""), {
    httpOptions: config?.axios,
  });

export const useCreateUser = <Res = R<any>>(
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.USER.CREATE, {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useUpdateUser = <Res = R<any>>(
  id: string,
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.USER.UPDATE(id), {
    method: "PUT",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });


  export const useDeleteUser = <Res = R<any>>(
    id?: string,
    config?: ServiceMutationConfig<Res>,
  ) =>
    {
      return useHttpMutation<Res, Err>(API.USER.DELETE(id ?? ""), {
        method: "DELETE",
        httpOptions: config?.axios,
        queryOptions: config?.query,
      });
    };