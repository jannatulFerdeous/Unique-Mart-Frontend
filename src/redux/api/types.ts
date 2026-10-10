export type ApiMeta = {
  page: number;
  limit: number;
  totalPage: number;
  total: number;
};

// Envelope every backend route answers with (backend `sendResponse`).
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
};

export type ApiErrorBody = {
  success: false;
  message: string;
};
