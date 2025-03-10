import { R } from "@/types/response";
import { API, Err, ServiceMutationConfig } from "..";
import { TicketCommentPayload, ResponseListComment } from "./comment.types";
import { ResponseDetailTicket } from "./detail.ticket.types";
import {
  PayloadExportTicket,
  PayloadTicketList,
  ResponseListTicket,
} from "./ticket.list.types";
import { PayloadTimeLogs, ResponseListLogs } from "./list.log.types";

// Hook for creating a new comment
export const useCreateComment = <Res = ResponseListComment>(
  config?: ServiceMutationConfig<Res, TicketCommentPayload>,
) =>
  useHttpMutation<Res, Err, TicketCommentPayload>(API.TICKET.COMMENT.CREATE, {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

  export const useAddToMyTask = <Res = R<any>>(
    id: string,
    config?: ServiceMutationConfig<Res>,
  ) =>
    useHttpMutation<Res, Err>(API.TICKET.ADD_TO_MY_TASK(id), {
      method: "POST",
      httpOptions: config?.axios,
      queryOptions: config?.query,
    });


// Hook for fetching comment details
export const useCommentDetail = <Res = ResponseListComment>(id: string) =>
  useHttp<Res>(API.TICKET.COMMENT.DETAIL(id), {});

// Hook for listing comments
export const useCommentList = <Res = ResponseListComment>(id: string, paginate: {
  page: number;
  limit: number;
  sort: string;
  dir: string;
}) =>
  useHttp<Res>(API.TICKET.COMMENT.LIST(id), {params: { ...paginate}});

// Function for fetching ticket detail
export const useTicketDetail = <Res = ResponseDetailTicket>(id: string) =>
  useHttp<Res>(API.TICKET.DETAIL(id));

// Function for Listing ticket
export const useTicketList = <Res = ResponseListTicket>(
  paginate: PayloadTicketList,
) => useHttp<Res>(API.TICKET.LIST, { params: { ...paginate } });

export const useTaskList = <Res = ResponseListTicket>(
  paginate: PayloadTicketList,
) => useHttp<Res>(API.TICKET.TASK_LIST, { params: { ...paginate } });

export const useExportTicket = (
  params: PayloadExportTicket,
  config?: ServiceMutationConfig,
) =>
  useHttpMutation(API.TICKET.EXPORT, {
    method: "GET",
    params: { ...params },
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const usePauseTime = <Res = R<any>>(
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.TICKET.PAUSE_LOG(), {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useResumeTime = <Res = R<any>>(
  config?: ServiceMutationConfig<Res>,
) =>
  useHttpMutation<Res, Err>(API.TICKET.RESUME_LOG, {
    method: "POST",
    httpOptions: config?.axios,
    queryOptions: config?.query,
  });

export const useTimeLogs = <Res = ResponseListLogs>(
  paginate: PayloadTimeLogs,
) => useHttp<Res>(API.TICKET.TIME_LOG.LIST, { params: { ...paginate } });
