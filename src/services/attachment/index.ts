import { API, Err, ServiceMutationConfig } from "..";
import { ResponseAttachment } from "./attachment.types";
import { ResponseUploadAttachment } from "./upload.attachment.types";

export const useUploadAttachment = <Res = ResponseUploadAttachment>(
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.ATTACHMENT.UPLOAD, {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useAttachmentDetail = <Res = ResponseAttachment>(
  id: string,
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.ATTACHMENT.DETAIL(id), {
    method: "GET",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });
