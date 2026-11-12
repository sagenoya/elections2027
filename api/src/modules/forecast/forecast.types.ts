/**
 * Published snapshot contract. The web app mirrors these types in
 * web/repository/modules/types/forecast.ts — change both together and bump SCHEMA_VERSION.
 */
export const SCHEMA_VERSION = 1;

export type SnapshotStatus = 'pre_launch' | 'live' | 'frozen';
export type ZoneCode = 'NORTH_CENTRAL' | 'NORTH_EAST' | 'NORTH_WEST' | 'SOUTH_EAST' | 'SOUTH_SOUTH' | 'SOUTH_WEST';

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
  /** Chance the candidate gets at least 25% of the vote in this state. */
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
  /** Expected number of states (incl. FCT) where the candidate reaches 25%. */
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
