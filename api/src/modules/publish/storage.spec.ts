import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { LocalStorage } from './storage.js';

describe('LocalStorage', () => {
  let dir: string;
  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'tilt-pub-'));
  });
  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  const opts = { contentType: 'application/json', cacheControl: 'no-cache' };

  it('writes nested keys', async () => {
    const s = new LocalStorage(dir);
    await s.put('forecast/history/v1.json', '{"a":1}', opts);
    expect(await readFile(join(dir, 'forecast/history/v1.json'), 'utf8')).toBe('{"a":1}');
  });

  it('refuses to write outside the publish dir', async () => {
    const s = new LocalStorage(dir);
    await expect(s.put('../escape.json', '{}', opts)).rejects.toThrow(/outside publish dir/);
  });
});
