import type { HttpMethod, ICallOptions } from "./modules/types/common";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly url: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const trimSlash = (s: string) => s.replace(/\/+$/, "");

/**
 * Base class for every repository module: URL building, fetch, error parsing.
 * Components never call fetch directly; they go through $api (usually via a hook).
 */
export class FetchFactory {
  constructor(protected readonly baseUrl: string) {}

  protected buildUrl(path: string, opts?: ICallOptions): string {
    let p = path;
    for (const [k, v] of Object.entries(opts?.urlHash ?? {})) {
      p = p.replaceAll(`#{${k}}`, encodeURIComponent(v));
    }
    const url = `${trimSlash(this.baseUrl)}${p}`;
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(opts?.query ?? {})) {
      if (v !== undefined) params.set(k, String(v));
    }
    const qs = params.toString();
    return qs ? `${url}?${qs}` : url;
  }

  protected async call<TBody, TRes>(method: HttpMethod, path: string, opts?: ICallOptions<TBody>): Promise<TRes> {
    const url = this.buildUrl(path, opts);
    let res: Response;
    try {
      res = await fetch(url, {
        method,
        signal: opts?.signal,
        headers: opts?.body ? { "Content-Type": "application/json" } : undefined,
        body: opts?.body ? JSON.stringify(opts.body) : undefined,
      });
    } catch {
      throw new ApiError("Network error. Check your connection.", 0, url);
    }
    if (!res.ok) {
      let message = `Request failed (${res.status})`;
      try {
        const body = (await res.json()) as { message?: string | string[] };
        if (body.message) message = Array.isArray(body.message) ? body.message.join(", ") : body.message;
      } catch {
        /* non-JSON error body */
      }
      throw new ApiError(message, res.status, url);
    }
    return (await res.json()) as TRes;
  }
}
