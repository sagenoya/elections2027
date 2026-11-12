import { Controller, Get, HttpCode, Post, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AdminKeyGuard } from '../../common/guards/admin-key.guard.js';
import { ForecastService } from './forecast.service.js';
import { ListRunsQuery } from './dto/list-runs.query.js';

/** Admin only: the public reads snapshots from the CDN, never from this API. */
@UseGuards(AdminKeyGuard)
@Controller('forecast')
export class ForecastController {
  constructor(private readonly forecast: ForecastService) {}

  @Get('runs')
  listRuns(@Query() q: ListRunsQuery) {
    return this.forecast.listRuns(q.limit ?? 20);
  }

  /** Trigger a run now and publish the result. */
  @Throttle({ default: { limit: 6, ttl: 60_000 } })
  @Post('runs')
  @HttpCode(201)
  triggerRun() {
    return this.forecast.run('manual');
  }
}
