"use client";

import { useForecast } from "@/hooks/use-forecast";
import { useNow } from "@/hooks/use-now";
import { ZONE_LABELS, ZONE_ORDER } from "@/lib/format";
import { CountdownCard } from "./countdown-card";
import { LiveStatus } from "./live-status";
import { StateTile } from "./state-tile";

export function ForecastBoard() {
  const { version, snapshot } = useForecast();
  const now = useNow(1000);
  const data = snapshot.data;
  const isLoading = version.isLoading || (snapshot.isLoading && !data);
  const isError = version.isError || snapshot.isError;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <LiveStatus generatedAt={data?.generatedAt} isError={isError} isLoading={isLoading} now={now} />
        {data && <span className="font-mono text-xs text-muted">snapshot {data.version}</span>}
      </div>

      <section className="grid gap-3 sm:grid-cols-2">
        <CountdownCard label="Presidential & National Assembly" date={data?.elections.presidential ?? "2027-01-16"} now={now} />
        <CountdownCard label="Governorship & State Assembly" date={data?.elections.governorship ?? "2027-02-06"} now={now} />
      </section>

      {data?.status === "pre_launch" && (
        <p className="rounded-xl border border-border bg-surface-strong p-4 text-sm text-muted">
          The forecast model is being built and backtested. Odds will appear here once it passes its 2023
          backtest. Until then this page shows the live data pipeline working.
        </p>
      )}

      {isError && !data && (
        <p className="rounded-xl border border-border bg-surface p-4 text-sm text-danger">
          We can&apos;t reach the forecast data right now. We&apos;ll keep retrying.
        </p>
      )}

      {isLoading && !data && (
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4" aria-hidden>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-surface-strong" />
          ))}
        </div>
      )}

      {data &&
        ZONE_ORDER.map((zone) => {
          const states = data.states.filter((s) => s.zone === zone);
          if (!states.length) return null;
          return (
            <section key={zone} aria-labelledby={`zone-${zone}`}>
              <h2 id={`zone-${zone}`} className="mb-3 text-sm font-semibold text-muted">
                {ZONE_LABELS[zone]} <span className="font-normal">· {states.length}</span>
              </h2>
              <ul className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {states.map((s) => (
                  <StateTile key={s.code} state={s} />
                ))}
              </ul>
            </section>
          );
        })}
    </div>
  );
}
