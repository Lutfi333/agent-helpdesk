import { IdName } from "@/types/common";
import { R } from "@/types/response";

export type ResponseUpdateCustomer = R<Data>;

export type Data = {
  id: string;
  company: IdName;
  name: string;
  code: string;
  logo: Logo;
  ticketTotal: number;
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: null;
};

export type Logo = {
  id: string;
  name: string;
  size: number;
  url: string;
  type: string;
  isPrivate: boolean;
  providerKey: string;
};

export type Validation = {};
