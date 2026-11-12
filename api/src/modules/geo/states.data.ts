import type { Zone } from '../../generated/prisma/enums.js';

export interface StateSeed {
  /** ISO 3166-2:NG suffix. */
  code: string;
  name: string;
  zone: Zone;
  /** False for the 8 off-cycle states and the FCT. */
  hasGovernorshipElection2027: boolean;
}

/** States whose governorship elections run off-cycle (not on 6 Feb 2027). */
export const OFF_CYCLE_GOVERNORSHIP_STATES = ['AN', 'BY', 'ED', 'EK', 'IM', 'KO', 'ON', 'OS'] as const;

const S = (code: string, name: string, zone: Zone): StateSeed => ({
  code,
  name,
  zone,
  hasGovernorshipElection2027:
    code !== 'FC' && !(OFF_CYCLE_GOVERNORSHIP_STATES as readonly string[]).includes(code),
});

/** The 36 states and the FCT, grouped by geopolitical zone. */
export const STATES: readonly StateSeed[] = [
  // North Central
  S('BE', 'Benue', 'NORTH_CENTRAL'),
  S('KO', 'Kogi', 'NORTH_CENTRAL'),
  S('KW', 'Kwara', 'NORTH_CENTRAL'),
  S('NA', 'Nasarawa', 'NORTH_CENTRAL'),
  S('NI', 'Niger', 'NORTH_CENTRAL'),
  S('PL', 'Plateau', 'NORTH_CENTRAL'),
  S('FC', 'Federal Capital Territory', 'NORTH_CENTRAL'),
  // North East
  S('AD', 'Adamawa', 'NORTH_EAST'),
  S('BA', 'Bauchi', 'NORTH_EAST'),
  S('BO', 'Borno', 'NORTH_EAST'),
  S('GO', 'Gombe', 'NORTH_EAST'),
  S('TA', 'Taraba', 'NORTH_EAST'),
  S('YO', 'Yobe', 'NORTH_EAST'),
  // North West
  S('JI', 'Jigawa', 'NORTH_WEST'),
  S('KD', 'Kaduna', 'NORTH_WEST'),
  S('KN', 'Kano', 'NORTH_WEST'),
  S('KT', 'Katsina', 'NORTH_WEST'),
  S('KE', 'Kebbi', 'NORTH_WEST'),
  S('SO', 'Sokoto', 'NORTH_WEST'),
  S('ZA', 'Zamfara', 'NORTH_WEST'),
  // South East
  S('AB', 'Abia', 'SOUTH_EAST'),
  S('AN', 'Anambra', 'SOUTH_EAST'),
  S('EB', 'Ebonyi', 'SOUTH_EAST'),
  S('EN', 'Enugu', 'SOUTH_EAST'),
  S('IM', 'Imo', 'SOUTH_EAST'),
  // South South
  S('AK', 'Akwa Ibom', 'SOUTH_SOUTH'),
  S('BY', 'Bayelsa', 'SOUTH_SOUTH'),
  S('CR', 'Cross River', 'SOUTH_SOUTH'),
  S('DE', 'Delta', 'SOUTH_SOUTH'),
  S('ED', 'Edo', 'SOUTH_SOUTH'),
  S('RI', 'Rivers', 'SOUTH_SOUTH'),
  // South West
  S('EK', 'Ekiti', 'SOUTH_WEST'),
  S('LA', 'Lagos', 'SOUTH_WEST'),
  S('OG', 'Ogun', 'SOUTH_WEST'),
  S('ON', 'Ondo', 'SOUTH_WEST'),
  S('OS', 'Osun', 'SOUTH_WEST'),
  S('OY', 'Oyo', 'SOUTH_WEST'),
];

export const ELECTION_DATES = {
  presidential: '2027-01-16',
  governorship: '2027-02-06',
} as const;
