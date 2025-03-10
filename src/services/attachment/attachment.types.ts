import { IdName } from "@/types/common";
import { R } from "@/types/response";

export type ResponseAttachment = R<Data>;

export interface Data {
  id: string;
  company: IdName;
  name: string;
  provider: string;
  providerKey: string;
  type: string;
  size: number;
  url: string;
  expiredUrlAt: Date;
  isUsed: boolean;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Validation {}
