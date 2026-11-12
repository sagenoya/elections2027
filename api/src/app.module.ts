import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from './config/config.module.js';
import { PrismaModule } from './modules/prisma/prisma.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { ForecastModule } from './modules/forecast/forecast.module.js';

@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(),
    // Default: 60 requests per minute per IP. Many users share one IP behind mobile NAT,
    // but the public never calls this API (they read the CDN), so this is mostly for admin routes.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    PrismaModule,
    HealthModule,
    ForecastModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
