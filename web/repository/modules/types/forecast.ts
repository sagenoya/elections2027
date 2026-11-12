/**
 * Mirrors api/src/modules/forecast/forecast.types.ts.
 * Change both together and bump schemaVersion on breaking changes.
 */
export type SnapshotStatus = "pre_launch" | "live" | "frozen";
export type ZoneCode =
  | "NORTH_CENTRAL"
  | "NORTH_EAST"
  | "NORTH_WEST"
  | "SOUTH_EAST"
  | "SOUTH_SOUTH"
  | "SOUTH_WEST";

export interface ICandidateRef {
  id: string;
  name: string;
  party: string;
}

export interface IStateCandidateForecast {
  candidateId: string;
  winProbability: number;
  shareMean: number;
  shareP10: number;
  shareP90: number;
  p25: number;
}

export interface IStateSnapshot {
  code: string;
  name: string;
  zone: ZoneCode;
  hasGovernorshipElection: boolean;
  presidential: IStateCandidateForecast[] | null;
}

export interface INationalCandidateForecast extends ICandidateRef {
  winProbability: number;
  expectedStatesAt25: number;
  nationalShareMean: number;
}

export interface INationalForecast {
  candidates: INationalCandidateForecast[];
  runoffProbability: number;
  simulations: number;
}

export interface IForecastSnapshot {
  schemaVersion: number;
  version: string;
  generatedAt: string;
  status: SnapshotStatus;
  modelVersion: string;
  elections: { presidential: string; governorship: string };
  national: INationalForecast | null;
  states: IStateSnapshot[];
}

export interface IForecastVersion {
  version: string;
  generatedAt: string;
}
