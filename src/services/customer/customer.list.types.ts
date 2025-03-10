"use client";
import { IdName } from "@/types/common";
import { P } from "@/types/response";

export type ResponseListCustomer = P<ListCustomerData>;

export interface PayloadCustomerList {
  page: number;
  limit: number;
  sort?: string;
  dir?: string;
}

export type ListCustomerData = {
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

export type ID = "673ac4ba2088a026e73fe840";

export type Name = "Demo Solutionlab";

export type Logo = {
  id: string;
  name: string;
  size: number;
  url: string;
  type: Type;
  isPrivate: boolean;
  providerKey: string;
};

export type Type = "" | "image";

export type Validation = {};
