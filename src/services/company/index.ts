import { API, ServiceConfig } from "..";
import { CompanyDetailResponse } from "./types";

export const useDetailCompany = <Res = CompanyDetailResponse>(
  config?: ServiceConfig<Res>,
) => useHttp<Res>(API.COMPANY.DETAIL, {
  httpOptions: config?.axios,
});
