import { IdName } from "@/types/common";
import { R } from "@/types/response";

export type ResponseUploadLogo = R<Data>;

export type Data = {
  id: string;
  company: IdName;
  name: string;
  provider: string;
  providerKey: string;
  type: string;
  size: number;
  url: string;
  expiredUrlAt: null;
  isUsed: boolean;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Validation = {};
