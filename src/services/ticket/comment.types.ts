import { P } from "@/types/response";
import { IdName } from "@/types/common";
import { Attachment } from "./detail.ticket.types";

export type ResponseListComment = P<ListCommentData>;

export interface ListCommentData {
  id: string;
  company: IdName;
  product: IdName;
  ticket: Ticket;
  agent: IdName;
  customer: IdName;
  sender: string;
  content: string;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  subject: string;
}
export interface TicketCommentPayload {
  ticketId?: string;
  content: string;
  status: string;
  attachIds: string[];
}

export interface Validation {}
