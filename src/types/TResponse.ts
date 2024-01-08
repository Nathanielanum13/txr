export interface TResponse {
  data: TData;
  meta: TMeta;
}

interface TData {
  data: any;
  status: string;
  errors: [];
  message: string;
  code: number;
}

interface TMeta {
    timestamp: string;
    traceid: string;
}