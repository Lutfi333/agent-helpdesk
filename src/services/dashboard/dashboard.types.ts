import { R } from "@/types/response";

export type ResponseDashboard = R<Data>;

export interface Data {
  totalTicketClosed: number;
  totalTicketInProgress: number;
  totalTicketOpen: number;
  totalTicketResolved: number;
}

export interface Validation {}
