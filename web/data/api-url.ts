/**
 * Every data path the web app reads. Params use #{name}.
 * Paths are relative to NEXT_PUBLIC_DATA_URL (the CDN), not the NestJS API:
 * the public site never calls the API directly.
 */
export const API_URLS = {
  forecast: {
    version: "/forecast/version.json",
    latest: "/forecast/latest.json",
    history: "/forecast/history/#{version}.json",
  },
} as const;
