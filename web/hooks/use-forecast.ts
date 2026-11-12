"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { $api } from "@/repository";

const POLL_MS = Number(process.env.NEXT_PUBLIC_POLL_INTERVAL_MS ?? 15_000);

export const forecastKeys = {
  all: ["forecast"] as const,
  version: () => [...forecastKeys.all, "version"] as const,
  detail: (version: string) => [...forecastKeys.all, "detail", version] as const,
};

/** Polls the tiny version file. When it changes, useForecast loads the new snapshot. */
export function useForecastVersion() {
  return useQuery({
    queryKey: forecastKeys.version(),
    queryFn: ({ signal }) => $api.forecast.version(signal),
    refetchInterval: POLL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: POLL_MS / 2,
  });
}

/** The current snapshot. Keeps showing the previous one while a new version loads. */
export function useForecast() {
  const version = useForecastVersion();
  const v = version.data?.version;
  const snapshot = useQuery({
    queryKey: forecastKeys.detail(v ?? ""),
    queryFn: ({ signal }) => $api.forecast.get(v!, signal),
    enabled: !!v,
    staleTime: Infinity, // history files are immutable
    placeholderData: keepPreviousData,
  });
  return { version, snapshot };
}
