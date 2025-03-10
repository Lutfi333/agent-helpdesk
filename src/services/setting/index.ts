import {
  API,
  Err,
  ExtendedError,
  ServiceConfig,
  ServiceMutationConfig,
} from "..";
import { ResponseUploadAttachment } from "../attachment/upload.attachment.types";
import { ConfigResponse } from "./types";

export const useUpdateProfile = (config?: ServiceMutationConfig) =>
  useHttpMutation(API.SETTING.UPDATE_PROFILE, {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useUploadProfile = <Res = ResponseUploadAttachment>(
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.SETTING.UPLOAD_PROFILE, {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

// export const useConfig = <Res = ConfigResponse>() =>
//   useHttp<Res>(API.SETTING.CONFIG);

export const useConfig = <Res = ConfigResponse>(config?: ServiceConfig<Res>) =>
  useHttp(API.SETTING.CONFIG, {
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useConfigMutation = <Res = ConfigResponse>(config?: ServiceConfig<Res>) =>
  useHttpMutation(API.SETTING.CONFIG, {
    method: "GET",
    httpOptions: config?.axios
  });

export const useChangeDomain = (config?: ServiceMutationConfig) =>
  useHttpMutation(API.SETTING.UPDATE_DOMAIN, {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useChangePassword = (config?: ServiceMutationConfig) =>
  useHttpMutation<ResponseUploadAttachment, ExtendedError>(
    API.SETTING.UPDATE_PASSWORD,
    {
      method: "POST",
      httpOptions: config?.axios,
    },
  );
