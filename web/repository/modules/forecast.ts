import { API_URLS } from "@/data/api-url";
import { FetchFactory } from "../factory";
import type { IForecastSnapshot, IForecastVersion } from "./types/forecast";

class ForecastModule extends FetchFactory {
  /** Tiny file polled to detect new snapshots. Cache-busted so polling always reaches the CDN. */
  version(signal?: AbortSignal) {
    return this.call<undefined, IForecastVersion>("GET", API_URLS.forecast.version, {
      query: { t: Math.floor(Date.now() / 10_000) },
      signal,
    });
  }

  /** The snapshot for a given version (immutable history file, cached forever by the CDN). */
  get(version: string, signal?: AbortSignal) {
    return this.call<undefined, IForecastSnapshot>("GET", API_URLS.forecast.history, {
      urlHash: { version },
      signal,
    });
  }

  latest(signal?: AbortSignal) {
    return this.call<undefined, IForecastSnapshot>("GET", API_URLS.forecast.latest, { signal });
  }
}

export default ForecastModule;
