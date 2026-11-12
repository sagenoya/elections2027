import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { PublishService } from '../publish/publish.service.js';
import { ELECTION_DATES } from '../geo/states.data.js';
import type { Prisma } from '../../generated/prisma/client.js';
import { SCHEMA_VERSION, type IForecastSnapshot } from './forecast.types.js';

/** Bumped whenever the model's method changes. Phase 0 publishes structure only. */
export const MODEL_VERSION = '0.0.0-phase0';

export interface RunSummary {
  runId: string;
  version: string;
  status: 'SUCCEEDED';
  durationMs: number;
}

@Injectable()
export class ForecastService {
  private readonly logger = new Logger(ForecastService.name);
  private running = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly publisher: PublishService,
  ) {}

  /** Sortable, unique snapshot id, e.g. 20261112T084512Z-3fa9. */
  static newVersion(now = new Date()): string {
    const ts = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    return `${ts}-${randomBytes(2).toString('hex')}`;
  }

  /**
   * Build the snapshot from the database. Phase 0: geography only, no forecast numbers.
   * The model (Phase 2) fills `national` and each state's `presidential`.
   */
  async buildSnapshot(version: string, now = new Date()): Promise<IForecastSnapshot> {
    const states = await this.prisma.state.findMany({
      select: { code: true, name: true, zone: true, hasGovernorshipElection2027: true },
      orderBy: [{ zone: 'asc' }, { name: 'asc' }],
    });

    return {
      schemaVersion: SCHEMA_VERSION,
      version,
      generatedAt: now.toISOString(),
      status: 'pre_launch',
      modelVersion: MODEL_VERSION,
      elections: { presidential: ELECTION_DATES.presidential, governorship: ELECTION_DATES.governorship },
      national: null,
      states: states.map((s) => ({
        code: s.code,
        name: s.name,
        zone: s.zone,
        hasGovernorshipElection: s.hasGovernorshipElection2027,
        presidential: null,
      })),
    };
  }

  /** Build, publish and record one run. Runs never overlap. */
  async run(trigger: string): Promise<RunSummary> {
    if (this.running) throw new ConflictException('A forecast run is already in progress');
    this.running = true;
    const started = Date.now();
    const version = ForecastService.newVersion();
    const run = await this.prisma.modelRun.create({
      data: { trigger, modelVersion: MODEL_VERSION, status: 'RUNNING' },
      select: { id: true },
    });

    try {
      const snapshot = await this.buildSnapshot(version);
      await this.publisher.publishSnapshot(snapshot);
      await this.prisma.modelRun.update({
        where: { id: run.id },
        data: {
          status: 'SUCCEEDED',
          snapshotVersion: version,
          snapshot: snapshot as unknown as Prisma.InputJsonValue,
          simulations: snapshot.national?.simulations ?? 0,
          finishedAt: new Date(),
        },
      });
      const durationMs = Date.now() - started;
      this.logger.log(`Run ${run.id} (${trigger}) succeeded in ${durationMs}ms -> ${version}`);
      return { runId: run.id, version, status: 'SUCCEEDED', durationMs };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await this.prisma.modelRun
        .update({ where: { id: run.id }, data: { status: 'FAILED', error: message.slice(0, 2000), finishedAt: new Date() } })
        .catch(() => undefined);
      this.logger.error(`Run ${run.id} (${trigger}) failed: ${message}`);
      throw err;
    } finally {
      this.running = false;
    }
  }

  listRuns(limit = 20) {
    return this.prisma.modelRun.findMany({
      orderBy: { startedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        status: true,
        trigger: true,
        modelVersion: true,
        snapshotVersion: true,
        simulations: true,
        error: true,
        startedAt: true,
        finishedAt: true,
      },
    });
  }
}
