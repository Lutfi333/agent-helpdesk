import { IdName } from "@/types/common";
import { P } from "@/types/response";

export interface PayloadTimeLogs {
  ticketId: string;
  page: number;
  limit: number;
}

export type ResponseListLogs = P<List>;

export interface List {
  id: string;
  company: IdName;
  customer: Customer;
  product: IdName;
  ticket: Ticket;
  durationInSeconds: number;
  pauseDurationInSeconds: number;
  startAt: Date;
  endAt: Date | null;
  pauseHistory: PauseHistory[] | null;
  isManual: boolean;
  activityType: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface PauseHistory {
  pausedAt: string;
  resumedAt: string | null;
  durationActive: number;
}

export interface Ticket {
  id: string;
  subject: string;
  content: string;
  priority: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
}
