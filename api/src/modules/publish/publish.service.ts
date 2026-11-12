import { Inject, Injectable, Logger } from '@nestjs/common';
import type { Env } from '../../config/env.js';
import { LocalStorage, R2Storage, type PublishStorage } from './storage.js';
import type { IForecastSnapshot, IForecastVersion } from '../forecast/forecast.types.js';

export const PUBLISH_STORAGE = Symbol('PUBLISH_STORAGE');

export function createStorage(env: Env): PublishStorage {
  return env.storageDriver === 'r2' && env.r2 ? new R2Storage(env.r2) : new LocalStorage(env.localPublishDir);
}

/**
 * Publishes forecast snapshots as static JSON for the CDN:
 *   forecast/history/<version>.json  immutable, cached forever
 *   forecast/latest.json             short cache
 *   forecast/version.json            tiny file browsers poll to detect updates (written LAST)
 */
@Injectable()
export class PublishService {
  private readonly logger = new Logger(PublishService.name);

  constructor(@Inject(PUBLISH_STORAGE) private readonly storage: PublishStorage) {}

  async publishSnapshot(snapshot: IForecastSnapshot): Promise<void> {
    const body = JSON.stringify(snapshot);
    const json = 'application/json; charset=utf-8';

    await this.storage.put(`forecast/history/${snapshot.version}.json`, body, {
      contentType: json,
      cacheControl: 'public, max-age=31536000, immutable',
    });
    await this.storage.put('forecast/latest.json', body, {
      contentType: json,
      cacheControl: 'public, max-age=15, stale-while-revalidate=30',
    });
    const version: IForecastVersion = { version: snapshot.version, generatedAt: snapshot.generatedAt };
    await this.storage.put('forecast/version.json', JSON.stringify(version), {
      contentType: json,
      cacheControl: 'public, max-age=10',
    });

    this.logger.log(`Published snapshot ${snapshot.version} via ${this.storage.name} (${body.length} bytes)`);
  }
}
