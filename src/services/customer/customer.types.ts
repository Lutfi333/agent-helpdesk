import { R } from "@/types/response";
import { ListCustomerData } from "./customer.list.types";

export type ResponseDetailCustomer = R<ListCustomerData>;
export interface CustomerCreatePayload {
  name: string;
  email: string;
  logoAttachId?: string;
}

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
