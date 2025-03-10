export type Response<T> = {
  status: number;
  message: string;
  data: T;
};

export type Paginate<T> = Response<{
  limit: number;
  page: number;
  total: number;
  totalPage: number;
  list: T[];
}>;

/** alias for Paginate */
export type P<T> = Paginate<T>;
/** alias for Response */
export type R<T> = Response<T>;
