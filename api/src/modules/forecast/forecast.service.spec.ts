import { ConflictException } from '@nestjs/common';
import { ForecastService } from './forecast.service.js';
import type { PrismaService } from '../prisma/prisma.service.js';
import type { PublishService } from '../publish/publish.service.js';
import type { IForecastSnapshot } from './forecast.types.js';

function setup(opts: { publishFails?: boolean; publishDelayMs?: number } = {}) {
  const states = [
    { code: 'KN', name: 'Kano', zone: 'NORTH_WEST', hasGovernorshipElection2027: true },
    { code: 'AN', name: 'Anambra', zone: 'SOUTH_EAST', hasGovernorshipElection2027: false },
  ];
  const prisma = {
    state: { findMany: vi.fn().mockResolvedValue(states) },
    modelRun: {
      create: vi.fn().mockResolvedValue({ id: 'run-1' }),
      update: vi.fn().mockResolvedValue({}),
      findMany: vi.fn().mockResolvedValue([]),
    },
  };
  const published: IForecastSnapshot[] = [];
  const publisher = {
    publishSnapshot: vi.fn(async (s: IForecastSnapshot) => {
      if (opts.publishDelayMs) await new Promise((r) => setTimeout(r, opts.publishDelayMs));
      if (opts.publishFails) throw new Error('R2 down');
      published.push(s);
    }),
  };
  const svc = new ForecastService(prisma as unknown as PrismaService, publisher as unknown as PublishService);
  return { svc, prisma, publisher, published };
}

describe('ForecastService', () => {
  it('creates sortable, unique versions', () => {
    const a = ForecastService.newVersion(new Date('2026-11-12T08:45:12.345Z'));
    expect(a).toMatch(/^20261112T084512Z-[0-9a-f]{4}$/);
  });

  it('builds a pre-launch snapshot with every state and no forecast numbers', async () => {
    const { svc } = setup();
    const snap = await svc.buildSnapshot('v1', new Date('2026-11-12T00:00:00Z'));
    expect(snap.status).toBe('pre_launch');
    expect(snap.national).toBeNull();
    expect(snap.elections).toEqual({ presidential: '2027-01-16', governorship: '2027-02-06' });
    expect(snap.states).toEqual([
      { code: 'KN', name: 'Kano', zone: 'NORTH_WEST', hasGovernorshipElection: true, presidential: null },
      { code: 'AN', name: 'Anambra', zone: 'SOUTH_EAST', hasGovernorshipElection: false, presidential: null },
    ]);
  });

  it('publishes and records a successful run', async () => {
    const { svc, prisma, published } = setup();
    const res = await svc.run('manual');
    expect(res.status).toBe('SUCCEEDED');
    expect(published).toHaveLength(1);
    expect(published[0]!.version).toBe(res.version);
    expect(prisma.modelRun.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: 'SUCCEEDED', snapshotVersion: res.version }) }),
    );
  });

  it('records a failed run and rethrows', async () => {
    const { svc, prisma } = setup({ publishFails: true });
    await expect(svc.run('cron')).rejects.toThrow('R2 down');
    expect(prisma.modelRun.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: 'FAILED', error: 'R2 down' }) }),
    );
  });

  it('rejects overlapping runs', async () => {
    const { svc } = setup({ publishDelayMs: 50 });
    const first = svc.run('cron');
    await expect(svc.run('manual')).rejects.toBeInstanceOf(ConflictException);
    await first;
    // A new run is allowed once the first finished.
    await expect(svc.run('manual')).resolves.toMatchObject({ status: 'SUCCEEDED' });
  });
});
