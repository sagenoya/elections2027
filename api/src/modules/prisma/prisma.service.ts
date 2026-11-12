import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';
import { ENV, type Env } from '../../config/env.js';

/** One shared pg Pool wrapped by the Prisma driver adapter. Never create clients per request. */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly pool: pg.Pool;

  constructor(@Inject(ENV) env: Env) {
    const pool = new pg.Pool({
      connectionString: env.databaseUrl,
      max: env.dbPoolMax,
      // Neon scales to zero: the first connection after idle can be slow.
      connectionTimeoutMillis: 30_000,
      idleTimeoutMillis: 60_000,
      keepAlive: true,
    });
    super({ adapter: new PrismaPg(pool) });
    this.pool = pool;
    pool.on('error', (err) => this.logger.error(`pg pool error: ${err.message}`));
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
