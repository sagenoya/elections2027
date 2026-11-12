/**
 * Typed, validated environment. Fails fast on boot when something required is missing.
 * `dotenv/config` is loaded in main.ts before this module is imported.
 */
export type StorageDriver = 'local' | 'r2';

export interface Env {
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
  databaseUrl: string;
  dbPoolMax: number;
  corsOrigins: string[];
  adminApiKey: string;
  storageDriver: StorageDriver;
  localPublishDir: string;
  r2: { accountId: string; accessKeyId: string; secretAccessKey: string; bucket: string } | null;
  /** Cron expression for the scheduled forecast publish. */
  publishCron: string;
  /** Turn scheduled jobs off (tests, one-off scripts). */
  schedulerEnabled: boolean;
}

function required(name: string): string {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing required env var: ${name}`);
  return v.trim();
}

export function loadEnv(): Env {
  const nodeEnv = (process.env['NODE_ENV'] ?? 'development') as Env['nodeEnv'];
  const isProd = nodeEnv === 'production';

  const corsOrigins = (process.env['CORS_ORIGINS'] ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (isProd && corsOrigins.length === 0) throw new Error('CORS_ORIGINS must be set in production');

  const adminApiKey = isProd ? required('ADMIN_API_KEY') : (process.env['ADMIN_API_KEY'] ?? 'dev-admin-key');
  if (isProd && adminApiKey.length < 32) throw new Error('ADMIN_API_KEY must be at least 32 characters');

  const storageDriver = (process.env['STORAGE_DRIVER'] ?? 'local') as StorageDriver;
  if (storageDriver !== 'local' && storageDriver !== 'r2') throw new Error('STORAGE_DRIVER must be "local" or "r2"');

  const r2 =
    storageDriver === 'r2'
      ? {
          accountId: required('R2_ACCOUNT_ID'),
          accessKeyId: required('R2_ACCESS_KEY_ID'),
          secretAccessKey: required('R2_SECRET_ACCESS_KEY'),
          bucket: required('R2_BUCKET'),
        }
      : null;

  return {
    nodeEnv,
    port: Number(process.env['PORT'] ?? 4000),
    databaseUrl: required('DATABASE_URL'),
    dbPoolMax: Number(process.env['DB_POOL_MAX'] ?? 5),
    corsOrigins,
    adminApiKey,
    storageDriver,
    localPublishDir: process.env['LOCAL_PUBLISH_DIR'] ?? '../web/public/data',
    r2,
    publishCron: process.env['PUBLISH_CRON'] ?? '0 */5 * * * *',
    schedulerEnabled: (process.env['SCHEDULER_ENABLED'] ?? 'true') === 'true',
  };
}

export const ENV = Symbol('ENV');
