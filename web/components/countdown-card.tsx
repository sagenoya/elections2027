import { daysUntil } from "@/lib/format";

type Props = { label: string; date: string; now: number | null };

export function CountdownCard({ label, date, now }: Props) {
  const days = now === null ? null : daysUntil(date, now);
  const pretty = new Date(`${date}T12:00:00+01:00`).toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs font-medium tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums">
        {days === null ? "–" : days}
        <span className="ml-1 text-base font-normal text-muted">{days === 1 ? "day" : "days"}</span>
      </p>
      <p className="mt-1 text-sm text-muted">{pretty}</p>
    </div>
  );
}
