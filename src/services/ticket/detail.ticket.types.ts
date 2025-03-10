import { IdName } from "@/types/common";
import { R } from "@/types/response";

export type ResponseDetailTicket = R<DetailTicketData>;

export interface DetailTicketData {
  id: string;
  company: Category;
  product: Product;
  customer: Customer;
  category: Category;
  subject: string;
  content: string;
  code: string;
  attachments: Attachment[];
  logTime: LogTime;
  priority: string;
  status: string;
  reminderSent: boolean;
  detailTime: DetailTime;
  assignedToMe: boolean;
  parent: null;
  closedAt: null;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  code: string;
}

export interface Category {
  id: string
  name: string
  type?: string
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  url: string;
  type: string;
  isPrivate?: boolean;
  providerKey?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface DetailTime {
  year: number;
  month: number;
  day: number;
  dayName: string;
}

export interface LogTime {
  startAt: string;
  endAt: null;
  durationInSeconds: number;
  pauseDurationInSeconds: number;
  status: string;
  totalDurationInSeconds: number;
  totalPauseDurationInSeconds: number;
  pauseHistory: PauseHistory[];
}

export interface PauseHistory {
  pausedAt: string;
  resumedAt: string | null;
  durationActive: number;
}

export interface Validation {}

export type P<T> = {
  data: {
    list: T[];
  };
  meta: {
    totalPages: number;
    currentPage: number;
  };
};
