import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export interface PutOptions {
  contentType: string;
  /** Sent as Cache-Control so the CDN knows how long to keep the file. */
  cacheControl: string;
}

/** Where published files go: a local folder in dev, Cloudflare R2 in production. */
export interface PublishStorage {
  readonly name: string;
  put(key: string, body: string, opts: PutOptions): Promise<void>;
}

export class LocalStorage implements PublishStorage {
  readonly name = 'local';
  private readonly root: string;

  constructor(dir: string) {
    this.root = resolve(dir);
  }

  async put(key: string, body: string, _opts?: PutOptions): Promise<void> {
    const path = resolve(this.root, key);
    if (!path.startsWith(this.root)) throw new Error(`Refusing to write outside publish dir: ${key}`);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, body, 'utf8');
  }
}

/** Cloudflare R2 through its S3-compatible API. */
export class R2Storage implements PublishStorage {
  readonly name = 'r2';
  private readonly client: S3Client;

  constructor(
    cfg: { accountId: string; accessKeyId: string; secretAccessKey: string; bucket: string },
    private readonly bucket = cfg.bucket,
  ) {
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey },
    });
  }

  async put(key: string, body: string, opts: PutOptions): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: opts.contentType,
        CacheControl: opts.cacheControl,
      }),
    );
  }
}
