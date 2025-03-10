import { R } from "@/types/response";
import { API, Err, ServiceMutationConfig } from "..";
import { CategoryDetailResponse, CategoryListResponse } from "./types";
import { useMutation } from "@tanstack/react-query";

export const useCategory = <Res = CategoryListResponse>(paginate: {
  page: number;
  limit: number;
  sort: string;
  dir: string;
}) => useHttp<Res>(API.CATEGORY.LIST, { params: { ...paginate } });

export const useCategoryDetail = <Res = CategoryDetailResponse>(
  id: string,
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.CATEGORY.DETAIL(id), {
    method: "GET",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useCategoryCreate = <Res = R<any>>(
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.CATEGORY.CREATE, {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useCategoryUpdate = <Res = R<any>>(
  id: string,
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.CATEGORY.UPDATE(id), {
    method: "PUT",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useCategoryDelete = <Res = R<any>>(
  id: string,
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.CATEGORY.DELETE(id), {
    method: "DELETE",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });
