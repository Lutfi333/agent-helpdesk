import { IdName } from "@/types/common";
import { R } from "@/types/response";

export type ResponseUploadAttachment = R<UploadAttachmentData>;

export interface UploadAttachmentData {
  id: string;
  company: IdName;
  name: string;
  provider: string;
  providerKey: string;
  type: string;
  size: number;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Validation {}
