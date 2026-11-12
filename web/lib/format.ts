import type { ZoneCode } from "@/repository/modules/types/forecast";

export const ZONE_LABELS: Record<ZoneCode, string> = {
  NORTH_CENTRAL: "North Central",
  NORTH_EAST: "North East",
  NORTH_WEST: "North West",
  SOUTH_EAST: "South East",
  SOUTH_SOUTH: "South South",
  SOUTH_WEST: "South West",
};

export const ZONE_ORDER: ZoneCode[] = [
  "NORTH_WEST",
  "NORTH_EAST",
  "NORTH_CENTRAL",
  "SOUTH_WEST",
  "SOUTH_EAST",
  "SOUTH_SOUTH",
];

export function timeAgo(iso: string, now: number): string {
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  return h < 24 ? `${h} h ago` : `${Math.round(h / 24)} d ago`;
}

/** Whole days from now until an election date (YYYY-MM-DD, West Africa Time). */
export function daysUntil(dateYmd: string, now: number): number {
  const target = new Date(`${dateYmd}T08:00:00+01:00`).getTime();
  return Math.max(0, Math.ceil((target - now) / 86_400_000));
}
