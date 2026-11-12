import { Module } from '@nestjs/common';
import { PublishModule } from '../publish/publish.module.js';
import { ForecastController } from './forecast.controller.js';
import { ForecastScheduler } from './forecast.scheduler.js';
import { ForecastService } from './forecast.service.js';

@Module({
  imports: [PublishModule],
  controllers: [ForecastController],
  providers: [ForecastService, ForecastScheduler],
})
export class ForecastModule {}
