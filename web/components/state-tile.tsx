import type { IStateSnapshot } from "@/repository/modules/types/forecast";

export function StateTile({ state }: { state: IStateSnapshot }) {
  return (
    <li className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2">
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium">{state.name}</span>
        <span className="font-mono text-xs text-muted">{state.code}</span>
      </span>
      {state.hasGovernorshipElection && (
        <span
          title="Governorship election on 6 Feb 2027"
          className="shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent"
        >
          Gov
        </span>
      )}
    </li>
  );
}
