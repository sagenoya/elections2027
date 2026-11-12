"use client";

import { timeAgo } from "@/lib/format";

type Props = { generatedAt?: string; isError: boolean; isLoading: boolean; now: number | null };

/** "Live · updated 12s ago" pill. Turns amber when the data source can't be reached. */
export function LiveStatus({ generatedAt, isError, isLoading, now }: Props) {
  const label = isLoading
    ? "Connecting…"
    : isError
      ? generatedAt
        ? `Reconnecting · last update ${now ? timeAgo(generatedAt, now) : ""}`
        : "Can't reach data"
      : generatedAt && now
        ? `Live · updated ${timeAgo(generatedAt, now)}`
        : "Live";
  const tone = isError ? "bg-warning" : "bg-live";

  return (
    <span
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted"
    >
      <span className="relative flex size-2">
        {!isError && !isLoading && (
          <span className={`absolute inline-flex size-full animate-ping rounded-full opacity-60 ${tone}`} />
        )}
        <span className={`relative inline-flex size-2 rounded-full ${tone}`} />
      </span>
      {label}
    </span>
  );
}
