export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ICallOptions<TBody = unknown> {
  /** Replaces #{name} placeholders in the URL. */
  urlHash?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
  body?: TBody;
  signal?: AbortSignal;
}

/** Envelope returned by the NestJS API (admin routes). CDN files are plain JSON. */
export interface IAPIResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  timestamp: string;
}
