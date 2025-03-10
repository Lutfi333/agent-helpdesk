import { IdName } from "@/types/common";
import { P } from "@/types/response";
import { Attachment, Customer } from "./detail.ticket.types";

export type ResponseListTicket = P<ListTicketDatum>;

export interface PayloadTicketList {
  page: number;
  limit: number;
  sort: string;
  dir: string;
  status?: string;
  subject?: string;
  code?: string;
  companyProductName?: string;
}

export interface PayloadExportTicket {
  startDate?: string;
  endDate?: string;
  status?: string;
  sort?: string;
  dir?: string;
}

export interface ListTicketDatum {
  id: string;
  company: IdName;
  product: IdName;
  category?: Category;
  customer: Customer;
  subject: string;
  content: string;
  attachments: Attachment | null;
  logTime: LogTime;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  closedAt: string | null;
  code: string;
}

export interface Category {
  id: string
  name: string
}

export interface LogTime {
  startAt: string | null;
  endAt: string | null;
  durationInSeconds: number;
  status: string;
}

export interface Validation {}
