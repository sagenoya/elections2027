import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ENV, type Env } from '../../config/env.js';
import { ForecastService } from './forecast.service.js';

/**
 * Publishes a fresh snapshot on a schedule (PUBLISH_CRON) and once at boot.
 * Run it on ONE instance only. Overlapping runs are rejected by ForecastService.
 * Phase 3 adds event-driven reruns (debounced) on top of this heartbeat.
 */
@Injectable()
export class ForecastScheduler implements OnApplicationBootstrap {
  private readonly logger = new Logger(ForecastScheduler.name);

  constructor(
    @Inject(ENV) private readonly env: Env,
    private readonly registry: SchedulerRegistry,
    private readonly forecast: ForecastService,
  ) {}

  onApplicationBootstrap() {
    if (!this.env.schedulerEnabled) {
      this.logger.warn('Scheduler disabled (SCHEDULER_ENABLED=false)');
      return;
    }
    const job = CronJob.from({
      cronTime: this.env.publishCron,
      onTick: () => void this.tick('cron'),
      start: true,
    });
    this.registry.addCronJob('forecast-publish', job);
    this.logger.log(`forecast-publish scheduled: "${this.env.publishCron}"`);
    void this.tick('boot');
  }

  private async tick(trigger: string) {
    try {
      await this.forecast.run(trigger);
    } catch (err) {
      // Already logged and recorded by ForecastService; keep the scheduler alive.
      if (!(err instanceof Error && err.message.includes('already in progress'))) return;
      this.logger.warn(`Skipped ${trigger} tick: previous run still in progress`);
    }
  }
}
