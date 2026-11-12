import { STATES, OFF_CYCLE_GOVERNORSHIP_STATES } from './states.data.js';

describe('STATES', () => {
  it('has the 36 states plus the FCT with unique codes and names', () => {
    expect(STATES).toHaveLength(37);
    expect(new Set(STATES.map((s) => s.code)).size).toBe(37);
    expect(new Set(STATES.map((s) => s.name)).size).toBe(37);
  });

  it('has the right number of states per zone', () => {
    const count = (z: string) => STATES.filter((s) => s.zone === z).length;
    expect(count('NORTH_CENTRAL')).toBe(7); // incl. FCT
    expect(count('NORTH_EAST')).toBe(6);
    expect(count('NORTH_WEST')).toBe(7);
    expect(count('SOUTH_EAST')).toBe(5);
    expect(count('SOUTH_SOUTH')).toBe(6);
    expect(count('SOUTH_WEST')).toBe(6);
  });

  it('marks 28 states as holding governorship elections in 2027', () => {
    const gov = STATES.filter((s) => s.hasGovernorshipElection2027);
    expect(gov).toHaveLength(28);
    for (const code of [...OFF_CYCLE_GOVERNORSHIP_STATES, 'FC']) {
      expect(gov.find((s) => s.code === code)).toBeUndefined();
    }
  });
});
