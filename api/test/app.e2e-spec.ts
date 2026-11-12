import { Test } from '@nestjs/testing';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter.js';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor.js';

/**
 * Needs a real database (DATABASE_URL) that has been migrated and seeded.
 * Skipped when DATABASE_URL is not set.
 */
const run = process.env['DATABASE_URL'] ? describe : describe.skip;

run('API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    process.env['SCHEDULER_ENABLED'] = 'false';
    process.env['ADMIN_API_KEY'] = 'e2e-admin-key';
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health reports the database is reachable', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/health').expect(200);
    expect(res.body).toMatchObject({ success: true, data: { status: 'ok' } });
  });

  it('rejects admin routes without the key', async () => {
    const res = await request(app.getHttpServer()).post('/api/v1/forecast/runs').expect(401);
    expect(res.body).toMatchObject({ success: false, statusCode: 401 });
  });

  it('validates query params', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/forecast/runs?limit=999')
      .set('x-admin-key', 'e2e-admin-key')
      .expect(400);
  });

  it('lists runs with the key', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/forecast/runs?limit=5')
      .set('x-admin-key', 'e2e-admin-key')
      .expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
