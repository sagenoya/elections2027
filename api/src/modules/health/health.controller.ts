import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { PrismaService } from '../prisma/prisma.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  /** Public: used by the platform healthcheck and uptime monitors. */
  @SkipThrottle()
  @Get()
  async check() {
    const t = Date.now();
    await this.prisma.$queryRaw`SELECT 1`;
    return {
      status: 'ok',
      dbLatencyMs: Date.now() - t,
      uptimeSec: Math.round(process.uptime()),
      heapUsedMb: Math.round(process.memoryUsage().heapUsed / 1048576),
    };
  }
}
