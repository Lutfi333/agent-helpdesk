import { API, Err, ServiceConfig, ServiceMutationConfig } from "..";
import { AuthLoginPayload, AuthLoginResponse, AuthMeResponse } from "./types";
export * from "./types";

export const useAuthLogin = <Res = AuthLoginResponse>(
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err, AuthLoginPayload>(API.AUTH.LOGIN, {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useAuthMe = <Res = AuthMeResponse>(config?: ServiceConfig<Res>) =>
  useHttp(API.AUTH.GET_ME, {
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const getMe = () => http.get(API.AUTH.GET_ME);
